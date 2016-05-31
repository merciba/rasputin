'use strict'

const Database = require('../lib/db')
const Promise = require('bluebird')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const userService = require('../services/userService')
const tokenService = require('../services/tokenService')

const signup = function * (next) {
	try {
		const password = this.request.body.password
		const hash = bcrypt.hashSync(password, null)
		
		this.request.body.password = hash
		
		const result = yield userService.createUser(this.request.body)

		this.request.user = this.request.body
		this.request.user.id = result.generated_keys[0]
		console.log('['+this.request.user.email+'] successfully signed up from '+this.state.userAgent.browser+' v'+this.state.userAgent.version+' on a(n) '+this.state.userAgent.platform+' '+this.state.userAgent.os+' machine')

		yield next
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const login = function * (next) {
	try {
		this.request.user = yield userService.getUserBy('email', this.request.body.email)
		let isMatch = userService.comparePasswords(this.request.body.password, this.request.user.password)
		if (isMatch) {
			console.log('['+this.request.user.email+'] successfully logged in from '+this.state.userAgent.browser+' v'+this.state.userAgent.version+' on a(n) '+this.state.userAgent.platform+' '+this.state.userAgent.os+' machine')
			yield next
		}
		else this.response.errorHandler("Passwords don't match.")
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const getUser = function * () {
	try {
		yield userService.getUser(this.params.id)
			.then(this.response.successHandler)
			.catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const getUsers = function * () {
	try {
		yield userService.getUsers()
			.then(this.response.successHandler)
			.catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const deleteUser = function * () {
	try {
		yield userService.deleteUser(this.request.params.id)
			.then(this.response.successHandler)
			.catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const deleteUsers = function * () {
	try {
		yield userService.deleteUsers()
			.then(this.response.successHandler)
			.catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const authenticate = function * (next) {
	try {
		let jwt_payload = jwt.verify(this.request.headers.authorization, process.env.JWT_SECRET)
		let token = yield tokenService.getTokenBy('value', jwt_payload.id)

		if (Date.now() < token.expires) {
			this.request.user = yield userService.getUser(jwt_payload.id)
			yield next
		}
		else throw new Error("Token is expired.")
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

module.exports = {
	signup: signup,
	getUser: getUser,
	getUsers: getUsers,
	login: login,
	deleteUser: deleteUser,
	deleteUsers: deleteUsers,
	authenticate: authenticate
}