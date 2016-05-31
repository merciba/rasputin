'use strict'

const fsSync = require('fs-sync'),
	fs = require('fs'),
	es = require('event-stream'),
	path = require('path'),
	childProcess = require('child_process'),
	_ = require('lodash'),
	oboe = require('oboe'),
	Promise = require('bluebird'),
	prompt = require('prompt'),
	ncp = Promise.promisifyAll(require('ncp').ncp),
	random = require('randomstring')

module.exports = function (rasputin) {
	prompt.message = "[Rasputin]".cyan
	const configureYAML = function () {
		if (fsSync.exists(path.join(__dirname, "../docker-compose.yml"))) return Promise.resolve(true)
		else {
			return new Promise(function (resolve, reject) {
				// Generate YAML
				const template = path.join(__dirname, "template.yml")
				const yaml = path.join(__dirname, "../docker-compose.yml")

				prompt.get({ 
					properties: {
						host: {
							description: "Hostname or IP for your app",
							type: 'string',
							pattern: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,
							message: 'Must be a valid hostname',
							default: '',
							required: true
						},
						name: {
							description: 'Name of your app',
							type: 'string',
							pattern: /^[A-Z]+$/i,
							message: 'Name must contain only the characters A-Z|a-z',
							default: '',
							required: true
						}
					}
				}, function (err, config) {
					if (err) reject(err)
					else {
						config.randomstring = random.generate()
						const options = {
							transform: function (read, write) {
								_.map(Object.keys(config), function (key) {
									read = read.pipe(es.replace("<"+key+">", config[key]))
								})
								read.pipe(write)
							}
						}
						
						ncp(template, yaml, options, function (err) { 
							if (err) reject(err)
							else resolve(false)
						})
					}
				})
			})
		}
	}
	const checkDocker = function (ymlExisted) {
		if (ymlExisted) {
			return Promise.all([
				new Promise(function (resolve, reject) {
					rasputin.spawn("docker", ["images"], { 
						stdout: function(data) {
							if (data.toString().match('rasputin_api')) resolve({ rasputin_api_image: true })
						}
					})
						.then(() => resolve({ rasputin_api_image: false }))
				}),
				new Promise(function (resolve, reject) {
					rasputin.spawn("docker", ["ps"], { 
						stdout: function(data) {
							if (data.toString().match('rasputin_api')) resolve({ rasputin_api_container: true })
						}
					})
						.then(() => resolve({ rasputin_api_container: false }))
				}),
				new Promise(function (resolve, reject) {
					rasputin.spawn("docker", ["images"], { 
						stdout: function(data) {
							if (data.toString().match('rasputin_db')) resolve({ rasputin_db_image: true })
						}
					})
						.then(() => resolve({ rasputin_db_image: false }))
				}),
				new Promise(function (resolve, reject) {
					rasputin.spawn("docker", ["ps"], { 
						stdout: function(data) {
							if (data.toString().match('rasputin_db')) resolve({ rasputin_db_container: true })
						}
					})
						.then(() => resolve({ rasputin_db_container: false }))
				})
			])
				.then(function (results) {
					results.map(function (result) {
						if (result.hasOwnProperty('rasputin_api_image')) {
							if (result.rasputin_api_image) rasputin.log("API Image: Up".green)
							else rasputin.log("API Image: Down".red)
						}
						if (result.hasOwnProperty('rasputin_db_image')) {
							if (result.rasputin_db_image) rasputin.log("DB Image: Up".green)
							else rasputin.log("DB Image: Down".red)
						}
						if (result.hasOwnProperty('rasputin_api_container')) {
							if (result.rasputin_api_container) rasputin.log("API Container: Up".green)
							else rasputin.log("API Container: Down".red)
						}
						if (result.hasOwnProperty('rasputin_db_container')) {
							if (result.rasputin_db_container) rasputin.log("DB Container: Up".green)
							else rasputin.log("DB Container: Down".red)
						}
					})
					return 0
				})
		}
		else {
			return require('./run')(rasputin);
		}
	}

	configureYAML()
		.then(checkDocker)
		.then(rasputin.done)
		.then(rasputin.error)
}