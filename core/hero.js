"use strict";

var db		= require("../common/mongoConnection.js").client;
var cfg		= require("../common/config.js");
var async	= require("async");
var ObjectID	= require("mongodb").ObjectID;

var ex = {};

function filterName(name) {
	return true;
};

ex.get = function (user_id, filters, cb) {
	if (!filters) filters = {};
	user_id = user_id.toString();

	db.collection("hero", function (err, collection) {
		collection.find({user_id: new ObjectID(user_id)}).toArray(function (err, heroes) {
			return cb(err, heroes);			
		});
	});
};

ex.create = function (user_id, map_id, d, cb) {	
	var userCollection;
	var heroCollection;

	if (!user_id || !(map_id>-1) || !d.name) return cb(new Error("Missing paramaters."));
	user_id = user_id.toString();
	if (!filterName(d.name)) return cb(new Error("Character name specified does not meet the requirements."));

	async.series([
		function (cb) {
			db.collection("user", function (err, collection) {
				userCollection = collection;
				return cb(err);
			});
		},
		function (cb) {
			db.collection("hero", function (err, collection) {
				heroCollection = collection;
				return cb(err);
			});
		},
		function (cb) {
			userCollection.findOne({_id: new ObjectID(user_id)}, function (err, user) {
				if (err) return cb(err);
				if (!user) return cb(new Error("user_id invalid: " + user_id));
				return cb(err);
			});
		},
		function (cb) {
			heroCollection.findOne({name: d.name}, function (err, hero) {
				if (err) return cb(err);
				if (hero) return cb(new Error("A hero with the name \"" + d.name + "\" already exists."));

				var c = {};
				c.name		= d.name;
				c.specialty	= d.specialty || "None";
				c.race		= d.race || "Human";
				c.user_id	= new ObjectID(user_id);
				c.map_id	= map_id;

				heroCollection.insert(c, function (err) {
					return cb(err);
				});
			});
		}
	], function (err) {
		return cb(err);
	});
};

module.exports = ex;
