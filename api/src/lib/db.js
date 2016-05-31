'use strict'

const rethinkdb = require('rethinkdb'),
	_ = require('lodash'),
	colors = require('colors'),
	Promise = require('bluebird'),
	logger = require('./logger'),
	tableManifest = require('../config/tables'),
	uuid = require('node-uuid'),
	events = require('events'),
	eventEmitter = new events.EventEmitter()

class Database {
	
	constructor() {
		this.emitter = eventEmitter
		if (process.env.NODE_ENV === 'test') return this.testSetup()
		else if (process.env.DB_NAME && process.env.DB_HOST) return this.connect()
		else logger.error("Fatal: Incorrect DB_NAME ("+process.env.DB_NAME+") or DB_HOST("+process.env.DB_HOST+")")
	}

	on(event, callback) {
		return this.emitter.on(event, callback)
	}

	connect() {
		this.tries = 0;
		this.name = process.env.DB_NAME
		const connect = () => {
			return rethinkdb.connect({ host: process.env.DB_HOST, port: (process.env.DB_PORT || 28015) })
				.then((connection) => {
					logger.log("Found host "+process.env.DB_HOST)
					this.connection = connection
				})
				.then(() => this.checkDatabase())
				.then(() => {
					this.emitter.emit('ready')
					logger.log("Ready.")
					return this
				})
				.catch(catchAndRetry)
		}
		const catchAndRetry = (err) => {
			if (this.tries < 10) {
				console.error("[Database] ".red, err.msg.red, "Retrying in 1s...");
				setTimeout(connect, 1000)
				this.tries += 1;
			}
			else process.exit(1)
		}
		connect()
		return this
	}

	testSetup() {
		this.name = 'TestDB'
		this.connection = {}
		this.create = function () { return Promise.resolve({ generated_keys: [ uuid.v4() ] }) }
		this.get = function (table, key, value) { 
			var obj = {}
			if (key && value) {
				obj.id = uuid.v4()
				obj[key] = value
				obj.value = 'fake-value'
				obj.expires = Date.now() + 60000000
				return Promise.resolve([obj])
			}
			else if (key) {
				obj.id = key
				return Promise.resolve([obj])
			}
			else return Promise.resolve([
					{ id: uuid.v4() },
					{ id: uuid.v4() },
					{ id: uuid.v4() },
					{ id: uuid.v4() },
					{ id: uuid.v4() }
				])
		}
		this.update = function (table, id) {
			return { replaced: 1 }
		}
		this.emitter.emit('ready')
		return this
	}

	checkDatabase() {
		logger.log("Checking Database...")
		return rethinkdb.dbList().run(this.connection)
			.then((dbs) => {
				const exists = _.includes(dbs, this.name)

				if (exists) return this.checkTables()
				else {
					logger.warn("Database '"+this.name+"' does not exist, creating it now...")
					return rethinkdb.dbCreate(this.name).run(this.connection)
						.then((result) => {
							if (result && result.hasOwnProperty('dbs_created') && (result.dbs_created === 1)) {
								return this.checkTables()
							}
						})
				}
			})
			.catch(logger.error)
	}

	checkTables() {
		logger.log("Checking Tables...")
		return rethinkdb.db(this.name).tableList().run(this.connection)
			.then((tables) => {
				return Promise.map(tableManifest, (tableName) => {
					if (!_.includes(tables, tableName)) {
						logger.warn("Table '"+tableName+"' does not exist, creating it now...")
						if (tableName === 'users') return rethinkdb.db(this.name).tableCreate(tableName).run(this.connection)
								.then(() => this.create('users', { scope: 'admin' }))
						else return rethinkdb.db(this.name).tableCreate(tableName).run(this.connection)
					}
				})
			})
			.catch(logger.error)
	}

	getFromCursor(cursor) {
		return new Promise(function(resolve, reject) {
			cursor.toArray(function(err, result) {
	            if (err) reject(err);
	            else resolve(result)
	        })
		})
	}

	create(table, data) {
		return rethinkdb.db(this.name).table(table).insert(data).run(this.connection)
	}

	get(table, key, value) {
		if (this.connection) {
			if (key && value) return rethinkdb.db(this.name).table(table).filter(rethinkdb.row(key).eq(value)).run(this.connection).then(this.getFromCursor)
			else if (key) return rethinkdb.db(this.name).table(table).get(key).run(this.connection)
			else return rethinkdb.db(this.name).table(table).run(this.connection).then(this.getFromCursor)
		}
		else throw new Error("No database connection!") 
	}

	update(table, id) {
		return rethinkdb.db(this.name).table(table).get(id).update().run(this.connection)
	}

	destroy(table, id) {
		if (id) return rethinkdb.db(this.name).table(table).get(id).delete().run(this.connection)
		else return rethinkdb.db(this.name).table(table).delete().run(this.connection)
	}

	singleResult(array) { return array[0] }

}	

module.exports = new Database()