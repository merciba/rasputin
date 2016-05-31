'use strict'

const Database = require('../lib/db')
const Promise = require('bluebird')
const FreshBooks = require("freshbooks")

function syncClients(apiUrl, apiToken) {
	console.log('Syncing Clients...')
	let freshbooks = null
	let client = null
	
	if (process.env.NODE_ENV !== 'test') {
		freshbooks = new FreshBooks(apiUrl, apiToken)
		client = new freshbooks.Client()
	}
	else client = { list: function (cb) { return cb(null, []) }}

	return new Promise(function (resolve, reject) {
		client.list(function (err, clients) {
			if (err) reject(err)
			else Promise.all(clients.map(function (obj) {
				return Database.get('clients', 'client_id', obj.client_id)
					.then(function (result) {
						if (!result.length) return Database.create('clients', obj)
						else return Promise.resolve()
					})
			}))
				.then(() => console.log("Clients synced."))
				.then(resolve)
				.catch(reject)
		})
	})
}

function getClient(id) {
	return Database.get('clients', 'client_id', id).then(Database.singleResult)
}

function getClients() {
	return Database.get('clients')
}

module.exports = {
	getClient,
	getClients,
	syncClients
}