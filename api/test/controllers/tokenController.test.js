'use strict'
process.env.JWT_SECRET = 'fake-secret'

const chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	tokenController = require('./../../src/controllers/tokenController')

let koa, next

describe('tokenController', function() {

	beforeEach(function () {
		tokenController.params = {}
		tokenController.request = {}
		tokenController.response = {
			successHandler: sinon.spy(),
			errorHandler: sinon.spy()
		}
		next = function * () {}
	})
	
	it('grantToken * () should grant a token', function * () {
		tokenController.request.user = { id: 'fake-id', email: 'test@test.com', password: 'fake-password' }
		
		let result = yield tokenController.grantToken()
		
		expect(tokenController.response.successHandler.called).to.be.ok
	})

	it('authenticate * () should authenticate a user', function * () {
		tokenController.request.user = { id: 'fake-id', email: 'test@test.com', password: 'fake-password' }
		
		let result = yield tokenController.authenticate()
		
		expect(tokenController.response.successHandler.calledWith(tokenController.request.user)).to.be.ok
	})

	afterEach(function () {
		tokenController.response.successHandler.reset()
		tokenController.response.errorHandler.reset()
	})
});