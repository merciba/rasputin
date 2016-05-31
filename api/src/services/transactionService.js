'use strict'

const Database = require('../lib/db')
const Promise = require('bluebird')
const plaid = require('plaid')

function getTransactions(clientId, secret, accessToken) {
	let plaidClient = new plaid.Client(clientId, secret, plaid.environments.tartan);
	return new Promise((resolve, reject) => {
		plaidClient.getConnectUser(accessToken, function(err, res) {
			if (err != null) reject(err)
			else resolve(res)
		})
	})
}

function authenticate(clientId, secret, publicToken) {
	let plaidClient = new plaid.Client(clientId, secret, plaid.environments.tartan);
	// Exchange a public_token for a Plaid access_token
	return new Promise((resolve, reject) => {
		plaidClient.exchangeToken(publicToken, (err, res) => {
		    if (err !== null) reject(err)
		    else resolve(res.access_token)
		})
	})
}

module.exports = {
	getTransactions,
	authenticate
}