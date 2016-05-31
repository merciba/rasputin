'use strict'

const orequire = require('orequire'),
	controllers = orequire('src/controllers')

module.exports = {
	"/api/user": [
		controllers.userController.authenticate,
		controllers.userController.deleteUsers
	],
	"/api/user/:id": [
		controllers.userController.authenticate,
		controllers.userController.deleteUser
	],
	"/api/token": [
		controllers.userController.authenticate,
		controllers.tokenController.deleteTokens
	]
}