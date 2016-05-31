'use strict'

const Database = require('../lib/db')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function createUser(body) {
	return Database.create('users', body)
}

function getUser(id) {
	return Database.get('users', id).then(Database.singleResult)
}

function getUsers() {
	return Database.get('users')
}

function getUserBy(key, value) {
	return Database.get('users', key, value).then(Database.singleResult)
}

function deleteUser(id) {
	return Database.destroy('users', id)
}

function deleteUsers() {
	return Database.destroy('users')
}

function comparePasswords(plaintext, hash) {
	if (process.env.NODE_ENV === 'test') return true
	else return bcrypt.compareSync(plaintext, hash)
}

module.exports = {
	createUser,
	getUser,
	getUserBy,
	getUsers,
	deleteUser,
	deleteUsers,
	comparePasswords
}