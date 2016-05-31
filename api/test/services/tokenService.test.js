'use strict'

var chai = require('chai');
var expect = chai.expect;
var tokenService = require('./../../src/services/tokenService');

describe('tokenService', function() {
	it('createToken(token) should create a token', function() {
		tokenService.createToken({ email: 'test@test.com', password: 'qwerty' })
			.then(function (token) {
				expect(token.generated_keys).to.exist
				expect(token.generated_keys[0]).to.be.a('string')
			})
	})

	it('getToken(id) should get token', function() {
		tokenService.getToken('fake-id')
			.then(function (token) {
				expect(token).to.exist
				expect(token.id).to.equal('fake-id')
			})
	})

	it('getTokens() should get all tokens', function() {
		tokenService.getTokens()
			.then(function (tokens) {
				expect(tokens).to.exist
				expect(tokens.length).to.equal(5)
			})
	})

	it('getTokenBy(key, value) should get a matching token', function() {
		tokenService.getTokenBy('fake_key', 'fake_value')
			.then(function (token) {
				expect(token).to.exist
				expect(token['fake_key']).to.equal('fake_value')
			})
	})
})