'use strict'

const Database = require('../lib/db')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const tokenService = require('../services/tokenService')
const transactionService = require('../services/transactionService')

const syncTransactions = function * (next) {
	let clientId = null 
	let clientSecret = null
	let accessToken = null
	try {
		clientId = yield tokenService.getTokenBy('name', 'PLAID_CLIENT_ID').catch(this.response.errorHandler)
		clientSecret = yield tokenService.getTokenBy('name', 'PLAID_SECRET').catch(this.response.errorHandler)
		accessToken = yield tokenService.getTokenBy('name', 'PLAID_ACCESS_TOKEN').catch(err => console.log('Could not find Plaid Access Token.'))
	}
	catch (err) {}

	if ((clientId && clientId.value) && (clientSecret && clientSecret.value) && (accessToken && accessToken.value)) {
		this.request.plaidClientId = true
		this.request.plaidClientSecret = true
		this.request.plaidAccessToken = true
					
		this.request.plaidStatus = true
	}
	else this.request.plaidStatus = false

	yield next
}

const getTransactions = function * () {
	try {
		let clientId = yield tokenService.getTokenBy('name', 'PLAID_CLIENT_ID')
		let clientSecret = yield tokenService.getTokenBy('name', 'PLAID_SECRET')
		let accessToken = yield tokenService.getTokenBy('name', 'PLAID_ACCESS_TOKEN')

		if (clientId && clientSecret && accessToken) this.response.body = yield transactionService.getTransactions(clientId.value, clientSecret.value, accessToken.value).catch(this.response.errorHandler) 
	    else this.response.errorHandler("No Plaid Token")
	}
    catch (err) {
		this.response.errorHandler(err)
	}
}

const authenticate = function * (next) {
	try {
		let clientId = yield tokenService.getTokenBy('name', 'PLAID_CLIENT_ID')
		let clientSecret = yield tokenService.getTokenBy('name', 'PLAID_SECRET')
		let accessToken = null
		console.log(clientId, clientSecret)
		if (clientId && clientSecret) accessToken = yield transactionService.authenticate(clientId.value, clientSecret.value, this.request.body.public_token)
		if (accessToken) yield tokenService.createToken({ name: 'PLAID_ACCESS_TOKEN', value: accessToken })
		yield next
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

module.exports = {
	syncTransactions: syncTransactions,
	getTransactions: getTransactions,
	authenticate: authenticate
}