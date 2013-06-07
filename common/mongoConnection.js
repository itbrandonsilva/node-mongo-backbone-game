var cfg = require("./config.js");
var mongo = require("mongodb");
var async = require("async");

var client = new mongo.Db('main', new mongo.Server(cfg.mongo_host, cfg.mongo_port, {}), {w:1});

module.exports = {client: false};

client.open(function(err, c) {
	if (err) throw new Error(err);
	console.log("Open!");
	module.exports.client = c;
});

