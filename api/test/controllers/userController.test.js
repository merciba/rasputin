'use strict'

process.env.JWT_SECRET = 'fake-secret'

const chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	jwt = require('jsonwebtoken'),
	userController = require('./../../src/controllers/userController')

let koa, next

describe('userController', function() {

	beforeEach(function () {
		userController.params = {}
		userController.request = {}
		userController.response = {
			successHandler: sinon.spy(),
			errorHandler: sinon.spy()
		}
		userController.state = { 
			userAgent: {
				browser: 'FakeBrowser',
				version: '0.0.0',
				os: 'OS X El Capitan',
				platform: 'Apple Mac'
			}
		}
		next = function * () {}
	})
	
	it('signup * () should sign a user up', function * () {
		userController.request.body = { email: 'test@test.com', password: 'fake-password' }
		
		let result = yield userController.signup(next)
		
		expect(userController.request.user).to.exist
		expect(userController.request.user.id).to.be.a('string')
	})

	it('login * () should log in a user', function * () {
		userController.request.body = { email: 'test@test.com', password: 'fake-password' }
		
		let result = yield userController.login(next)
		
		expect(userController.request.user).to.exist
		expect(userController.request.user.id).to.be.a('string')
	})

	it('getUser * () should get a user', function * () {
		userController.params.id = 'fake-id'
		userController.request.body = { email: 'test@test.com', password: 'fake-password' }
		
		let result = yield userController.getUser()
		expect(userController.response.successHandler.called).to.be.ok
	})

	it('authenticate * () should authenticate a user', function * () {
		userController.request.headers = { authorization: jwt.sign({ id: 'fake-id' }, 'fake-secret', { expiresIn: '1d' }) }
		
		let result = yield userController.authenticate()
		expect(userController.request.user).to.exist
		expect(userController.request.user.id).to.equal('fake-id')
	})

	afterEach(function () {
		userController.response.successHandler.reset()
		userController.response.errorHandler.reset()
	})
});