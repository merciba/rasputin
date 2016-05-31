'use strict'

var chai = require('chai');
var expect = chai.expect;
var userService = require('./../../src/services/userService');

describe('userService', function() {
	it('createUser(user) should create a user', function() {
		userService.createUser({ email: 'test@test.com', password: 'qwerty' })
			.then(function (user) {
				expect(user.generated_keys).to.exist
				expect(user.generated_keys[0]).to.be.a('string')
			})
	})

	it('getUser(id) should get user', function() {
		userService.getUser('fake-id')
			.then(function (user) {
				expect(user).to.exist
				expect(user.id).to.equal('fake-id')
			})
	})

	it('getUsers() should get all users', function() {
		userService.getUsers()
			.then(function (users) {
				expect(users).to.exist
				expect(users.length).to.equal(5)
			})
	})

	it('getUserBy(key, value) should get a matching user', function() {
		userService.getUserBy('fake_key', 'fake_value')
			.then(function (user) {
				expect(user).to.exist
				expect(user['fake_key']).to.equal('fake_value')
			})
	})

	/*it('deleteUser(id) should delete users', function() {
		userService.deleteUser()
			.then(console.log)
	})

	it('deleteUsers() should delete all users', function() {
		userService.deleteUsers()
			.then(console.log)
	})*/
});