'use strict'

const Database = require('../lib/db')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const clientService = require('../services/clientService')
const tokenService = require('../services/tokenService')

const syncClients = function * (next) {
	let apiUrl = null,
		apiToken = null,
		results = null

	try {
		apiUrl = yield tokenService.getTokenBy('name', 'FRESHBOOKS_API_URL').catch(this.response.errorHandler)
		apiToken = yield tokenService.getTokenBy('name', 'FRESHBOOKS_API_TOKEN').catch(this.response.errorHandler)
	}
	catch (err) {
		this.request.freshBooksStatus = false
	}
	if ((apiUrl && apiUrl.value) && (apiToken && apiToken.value)) {
		this.request.freshbooksApiUrl = true
		this.request.freshbooksApiToken = true
		results = yield clientService.syncClients(apiUrl.value, apiToken.value)
		this.request.freshBooksStatus = true
	}
	else this.request.freshBooksStatus = false
	yield next
}

const getClient = function * () {
	try {
		this.response.body = yield clientService.getClient(this.request.params.id).catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const getClients = function * () {
	try {
		this.response.body = yield clientService.getClients().catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

module.exports = {
	syncClients: syncClients,
	getClient: getClient,
	getClients: getClients
}