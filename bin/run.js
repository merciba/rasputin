const fsSync = require('fs-sync'),
	path = require('path')

module.exports = function (rasputin) {
	if (fsSync.exists(path.join(__dirname, "../docker-compose.yml"))) {
		console.log("Run")
		//return rasputin.spawn("docker-compose", ["up", "-d"], { cwd: __dirname }).then(rasputin.done)
	}
	else return require('./install')(rasputin)
}