'use strict'

const Database = require('../lib/db')
const Promise = require('bluebird')
const FreshBooks = require("freshbooks")

function syncInvoices(apiUrl, apiToken) {
	console.log('Syncing Invoices...')
	let freshbooks = null
	let invoice = null
	
	if (process.env.NODE_ENV !== 'test') {
		freshbooks = new FreshBooks(apiUrl, apiToken)
		invoice = new freshbooks.Invoice()
	}
	else invoice = { list: function (cb) { return cb(null, []) }}
	
	return new Promise(function (resolve, reject) {
		invoice.list(function (err, invoices) {
			if (err) reject(err)
			else Promise.all(invoices.map(function (obj) {
				return Database.get('invoices', 'invoice_id', obj.invoice_id)
					.then(function (result) {
						if (!result.length) return Database.create('invoices', obj)
						else return Promise.resolve()
					})
			}))
				.then(() => console.log("Invoices synced."))
				.then(resolve)
				.catch(reject)
		})
	})
}

function getInvoice(id) {
	return Database.get('invoices', 'invoice_id', id).then(Database.singleResult)
}

function getInvoices() {
	return Database.get('invoices')
}

module.exports = {
	getInvoice,
	getInvoices,
	syncInvoices
}