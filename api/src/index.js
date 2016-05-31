'use strict'

const fs = require('fs'),
	path = require('path'),
	_ = require('lodash')

if (process.env.NODE_ENV === 'development') {
	try {
	    fs.accessSync(path.join(__dirname, '../.env'));
	    require('dotenv').config()
	} catch (e) {}
}

const koa = require('koa'),
	logger = require('koa-logger')(),
	customLogger = require('./lib/logger'),
	serve = require('koa-static'),
	router = require('koa-router')(),
	parse = require('koa-body')(),
	params = require('koa-strong-params'),
	userAgent = require('koa-useragent'),
	qs = require('koa-qs'),
	sendfile = require('koa-sendfile'),
	orequire = require('orequire'),
	Promise = require('bluebird')

const Rasputin = function () {
	const rasputin = {},
		routes = orequire('src/routes')
	
	rasputin.app = koa()

	qs(rasputin.app)

	rasputin.app
		.use(parse)
		.use(params())
		.use(logger)
		.use(userAgent())
		.use(function * (next) {
			this.logger = customLogger
			this.response.sendfile = sendfile
			this.response.successHandler = (result) => {
				if (!result) result = { status: "ok" }
				this.response.status = 200
				this.response.body = result
			}
			this.response.errorHandler = (err) => {
				this.response.status = 500
				this.response.body = err
			}
			yield next
		})
		.use(router.routes())
		.use(serve('./public'))
		.use(require('./controllers/homeController').getIndex)
		.on('error', require('./lib/errorHandler'))

	_.map(routes, (route, method) => _.map(route, (controllers, url) => router[method].apply(router, [url].concat(controllers))))

	if (!module.parent) rasputin.app.listen(8000);

	return rasputin
}

module.exports = Rasputin()