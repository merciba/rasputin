'use strict'

const orequire = require('orequire'),
	controllers = orequire('src/controllers')

module.exports = {
	"/api/user": [
		controllers.userController.authenticate,
		controllers.userController.getUsers
	],
	"/api/user/:id": [
		controllers.userController.authenticate,
		controllers.userController.getUser
	],
	"/api/dashboard": [
		controllers.userController.authenticate,
		controllers.clientController.syncClients,
		controllers.invoiceController.syncInvoices,
		controllers.transactionController.syncTransactions,
		controllers.homeController.getDashboard
	],
	"/api/client": [
		controllers.userController.authenticate,
		controllers.clientController.getClients
	],
	"/api/client/:id": [
		controllers.userController.authenticate,
		controllers.clientController.getClient
	],
	"/api/invoice": [
		controllers.userController.authenticate,
		controllers.invoiceController.getInvoices
	],
	"/api/transaction": [
		controllers.userController.authenticate,
		controllers.transactionController.getTransactions
	],
	"/api/token": [
		//controllers.userController.authenticate,
		controllers.tokenController.getTokens
	]
}