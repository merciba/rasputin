'use strict'

const orequire = require('orequire'),
	controllers = orequire('src/controllers')

module.exports = {
	"/api/signup": [
		controllers.userController.signup,
		controllers.tokenController.grantToken
	],
	"/api/login": [
		controllers.userController.login,
		controllers.tokenController.grantToken
	],
	"/api/bank/authenticate": [
		controllers.transactionController.authenticate,
		controllers.transactionController.getTransactions
	],
	"/api/token/authenticate": [
		controllers.userController.authenticate,
		controllers.tokenController.authenticate
	],
	"/api/client/sync": [
		controllers.userController.authenticate,
		controllers.clientController.syncClients
	],
	"/api/token": [
		controllers.userController.authenticate,
		controllers.tokenController.createToken
	]
}