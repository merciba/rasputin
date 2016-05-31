'use strict'

const Database = require('../lib/db')
const logger = require('../lib/logger')
const Promise = require('bluebird')
let tokens = ['FRESHBOOKS_API_URL', 'FRESHBOOKS_API_TOKEN', 'PLAID_CLIENT_ID', 'PLAID_SECRET']

function getToken(id) {
	return Database.get('tokens', id).then(Database.singleResult)
}

function getTokens() {
	return Database.get('tokens')
}

function getTokenBy(key, value) {
	return Database.get('tokens', key, value).then(Database.singleResult)
}

function createToken(body) {
	return Database.create('tokens', body)
}

function deleteToken(id) {
	return Database.destroy('tokens', id)
}

function deleteTokens() {
	return Database.destroy('tokens')
}

function getExpiry(days) {
	return Date.now() + (1000 * 60 * 60 * 24)
}

Database.on('ready', function () {
	Promise.map(tokens, function (tokenName) {
		return getTokenBy('name', tokenName)
			.then((token) => {
				if (!token && process.env[tokenName]) return createToken({ name: tokenName, value: process.env[tokenName] })
				else return Promise.resolve()
			})
			.catch(() => {
				return Promise.resolve()
			})
	})
		.then(() => logger.log("Tokens injected."))
		.catch((err) => {
			throw new Error(err)
		})	
})

module.exports = {
	getToken,
	getTokens,
	getTokenBy,
	createToken,
	deleteToken,
	deleteTokens,
	getExpiry
}