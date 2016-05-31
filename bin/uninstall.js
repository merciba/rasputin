'use strict'

const fsSync = require('fs-sync'),
	fs = require('fs'),
	path = require('path'),
	childProcess = require('child_process'),
	_ = require('lodash'),
	oboe = require('oboe'),
	Promise = require('bluebird')

module.exports = function (rasputin) {
	const configureYAML = function () {
		if (fsSync.exists(path.join(__dirname, "../docker-compose.yml"))) return Promise.resolve(true)
		else {
			return new Promise(function (resolve, reject) {
				// Generate YAML
				const template = path.join(__dirname, "template.yml")
				const yaml = path.join(__dirname, "../docker-compose.yml")

				prompt.get({ 
					properties: {
						backup: {
							description: "Backup your data?",
							type: 'boolean',
							default: false,
							required: false
						}
					}
				}, function (err, config) {
					if (err) reject(err)
					else {
						if (config.backup) {

						}
					}
				})
			})
		}
	}
	const checkDocker = function (ymlExisted) {
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

	configureYAML()
		.then(checkDocker)
		.then(rasputin.done)
		.then(rasputin.error)
}