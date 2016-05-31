'use strict'

var chai = require('chai');
var expect = chai.expect;
var clientService = require('./../../src/services/clientService');

describe('clientService', function() {
	it('syncClients() should copy clients to db', function() {
		clientService.syncClients([
				{ client_id: 'fake-client-id' }
			])
			.then(function (result) {
				expect(result).to.exist
				expect(result[0]).to.exist
			})
	})

	it('getClient(client_id) should get client', function() {
		clientService.getClient('fake-client-id')
			.then(function (client) {
				expect(client).to.exist
				expect(client.client_id).to.equal('fake-client-id')
			})
	})
})