'use strict'

const Database = require('../lib/db')
const Promise = require('bluebird')
const FreshBooks = require('freshbooks')
const invoiceService = require('../services/invoiceService')
const tokenService = require('../services/tokenService')

const syncInvoices = function * (next) {
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
		results = yield invoiceService.syncInvoices(apiUrl.value, apiToken.value)
		this.request.freshBooksStatus = true
	}
	else this.request.freshBooksStatus = false
	yield next
}

const getInvoice = function * () {
	try {
		this.response.body = yield invoiceService.getInvoice(this.request.params.id).catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const getInvoices = function * () {
	try {
		this.response.body = yield invoiceService.getInvoices().catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

module.exports = {
	syncInvoices: syncInvoices,
	getInvoice: getInvoice,
	getInvoices: getInvoices
}