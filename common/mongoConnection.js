var cfg		= require("./config.js");
var mongo	= require("mongodb");
var async	= require("async");

var client 	= new mongo.Db(cfg.mongo.db, new mongo.Server(cfg.mongo.host, cfg.mongo.port, {}), {w:1});

ex		= {};
ex.client	= null;
ex.collections	= {};

ex.init = function (cb) {
	client.open(function(err, c) {
		if (err) throw new Error(err);
		ex.client = c;

		async.eachSeries(cfg.mongo.collections,
			function (collectionName, cb) {
				c.collection(collectionName, function (err, collection) {
					if (err) return cb(err);
					ex.collections[collectionName] = collection;
					return cb(err);
				});

			},
			function (err) {
				return cb(err);
			}
		);
	});
};

module.exports	= ex;
