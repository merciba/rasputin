'use strict'

const chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	clientController = require('./../../src/controllers/clientController')

let koa, next

describe('clientController', function() {

	beforeEach(function () {
		clientController.params = {}
		clientController.request = {}
		clientController.response = {
			successHandler: sinon.spy(),
			errorHandler: sinon.spy()
		}
		next = function * () {} 
	})
	
	it('syncClients * () should sync clients', function * () {	
		let result = yield clientController.syncClients(next)
		expect(clientController.request.freshBooksStatus).to.be.ok
	})

	afterEach(function () {
		clientController.response.successHandler.reset()
		clientController.response.errorHandler.reset()
	})
});