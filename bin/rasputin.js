#!/usr/bin/env node

'use strict'

const instance = {},
	fsSync = require('fs-sync'),
	fs = require('fs'),
	path = require('path'),
	childProcess = require('child_process'),
	pkg = require(path.join(__dirname, '../package.json')),
	colors = require('colors'),
	_ = require('lodash'),
	oboe = require('oboe'),
	Promise = require('bluebird')

const Rasputin = function (args) {
	
	instance.pkg = pkg
	instance.dirname = path.join(__dirname, '..')
	instance.args = args || []

	instance.log = log
	instance.error = error
	instance.done = done
	instance.spawn = spawn

	if (instance.args[0] && (instance.args[0][0] === '-')) {
		// handle flags
		switch (instance.args[0]) {
			case '-v':
				instance.log("v"+instance.pkg.version)
		}
	}

	// default command
	else if (!instance.args[0]) {
		require("./run")(instance)
	}
	
	// handle other commands
	else if (instance.args[0] && fs.exists(path.join(__dirname, instance.args[0]+".js"))) require("./"+instance.args[0])(instance)

	// handle error
	else instance.error("usage: rasputin <command> [<args>]")
	
	return instance
}

const log = function(args) {
	var badge = "[Rasputin]".cyan
	if (typeof args === 'string') console.log(badge, args)
	else if (_.isArray(args)) console.log.apply(console, [badge].concat(args))
}

const error = function(args) {
	var badge = "[Rasputin]".red
	if (typeof args === 'string') console.error(badge, args)
	else if (args instanceof Error) console.error(badge, args.message)
	else if (_.isArray(args)) console.error.apply(console, [badge].concat(args))

	this.done(1)
}

const done = function (code) {
	process.exit(code)
} 

const spawn = function () {
	let cmd = arguments[0],
		defaultFn = (data) => this.log(data.toString()),
		options = {
			cwd: ((arguments[2] && arguments[2].cwd) ? arguments[2].cwd : process.cwd()),
			stdout: ((arguments[2] && arguments[2].stdout) ? arguments[2].stdout : defaultFn),
			stderr: ((arguments[2] && arguments[2].stderr) ? arguments[2].stderr : defaultFn)
		},
		command = childProcess.spawn(cmd, arguments[1], { cwd: options.cwd })
	
	process.stdin.pipe(command.stdin)

	return new Promise(function (resolve, reject) {
		Object.keys(options)
			.map(function (key) {
				if (key === 'stdout') command.stdout.on('data', options.stdout)
				if (key === 'stderr') command.stderr.on('data', options.stderr)
			})

		command.on('exit', function (code) {
			setImmediate(function() {
				if (code === 0) resolve(code)
				else reject()
			})
		})
	})

}

module.exports = Rasputin(process.argv.slice(2))