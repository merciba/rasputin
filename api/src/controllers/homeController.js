'use strict'

const fs = require('fs')
const path = require('path')
const co = require('co')

const getIndex = function * () {
	yield this.response.sendfile(this, path.join(__dirname, '../../public/index.html'))
}

const getDashboard = function * () {
	try {
		this.response.body = {
			plaidStatus: this.request.plaidStatus,
			freshBooksStatus: this.request.freshBooksStatus
		}
	}
	catch (err) {
		this.response.errorHandler(err)
	}
} 

module.exports = {
	getIndex: getIndex,
	getDashboard: getDashboard
}