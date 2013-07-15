var core = require("./index.js");
var async = require("async");

async.until(
	function () {
		return core.ready;
	},
	function (cb) {
		console.log("Core is not ready...");		
		setTimeout(cb, 100);
	},
	function (err) {
		if (err) throw new Error(err);
		console.log("Core is ready!");
	}
);
