var db    = require("../common/mongoConnection.js");
var async = require("async");

var ex = {ready: false};
module.exports = ex;

console.log("Ready?: " + db.client);

async.until(
	function () {
		return db.client;
	},
	function (cb) {
		setTimeout(cb, 100)
	},
	function (err) {
		ex.user = require("./user.js");
		ex.map = require("./map.js");
		ex.hero = require("./hero.js");
		ex.ready = true;	
	}
);
