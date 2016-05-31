'use strict'

module.exports = {

	log: function (str) {
		console.log("[Database] ".green, str.green)
	},

	warn: function (str) {
		console.warn("[Database] ".yellow, str.yellow)
	},

	error: function (err) {
		if (err.message) console.error("[Database] ".red, err.message.red);
		else console.error("[Database] ".red, err.red);
	}

}