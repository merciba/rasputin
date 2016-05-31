'use strict'

const logger = require('../lib/logger')
const Promise = require('bluebird')
const jwt = require('jsonwebtoken')
const tokenService = require('../services/tokenService')

const grantToken = function * () {
	try {
		let expiryInDays = 1
		
		this.request.token = {
			name: 'AUTH_TOKEN',
			value: this.request.user.id,
			expires: tokenService.getExpiry(expiryInDays)
		}

		let result = yield tokenService.createToken(this.request.token).catch(this.response.errorHandler)

		this.response.successHandler({ 
			token: jwt.sign({ id: this.request.user.id }, process.env.JWT_SECRET, { expiresIn: expiryInDays.toString() + "d" }) 
		})
	}
	catch (err) {
		this.response.errorHandler(err)
	}
} 

const getTokens = function * () {
	try {
		yield tokenService.getTokens()
			.then(this.response.successHandler)
			.catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const createToken = function * () {
	try {
		yield tokenService.createToken(this.request.body)
			.then(this.response.successHandler)
			.catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const deleteToken = function * () {
	try {
		yield tokenService.deleteToken(this.request.params.id)
			.then(this.response.successHandler)
			.catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const deleteTokens = function * () {
	try {
		yield tokenService.deleteTokens()
			.then(this.response.successHandler)
			.catch(this.response.errorHandler)
	}
	catch (err) {
		this.response.errorHandler(err)
	}
}

const authenticate = function * () {
	this.response.successHandler(this.request.user)
} 

module.exports = {
	grantToken: grantToken,
	getTokens: getTokens,
	createToken: createToken,
	deleteToken: deleteToken,
	deleteTokens: deleteTokens,
	authenticate: authenticate
}