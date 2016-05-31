'use strict'

process.env.NODE_ENV = 'test'
var chai = require('chai');
var expect = chai.expect;
var app = require('./../src');
require('mocha-generators').install()

describe('', function() {
  it('App should successfully bootstrap with koa', function() {
  	expect(app).to.exist
  	expect(app.app).to.exist
  	expect(app.app.middleware).to.exist
  });
});

// -------- Services --------- //
require('./services/clientService.test')
require('./services/userService.test')
require('./services/tokenService.test')

// -------- Controllers --------- //
require('./controllers/clientController.test')
require('./controllers/userController.test')
require('./controllers/tokenController.test')