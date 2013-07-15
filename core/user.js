"use strict";

var bcrypt 		= require("bcrypt");
var cfg    		= require("../common/config.js");
var async  		= require("async");
var utils   	= require("../common/utils");
var ObjectId    = utils.Schema.ObjectId;

var models      = require("../common/models");

var ex = {};

ex.messages = {
    user: {
        invalidId: "The user_id is invalid."
    },
	registration: {
		usernameTaken: "Username has already been taken."
	},
	authentication: {
		incorrectUsername: "Incorrect username.",
		incorrectPassword: "Incorrect password."
	}
};

ex.register = function(username, password, email, cb) {
	var u = new models.User;
	u.username = username;
	u.pw_hash  = hashPassword(password);

	async.series([
		function (cb) {
			models.User.findOne({username: username}, function (err, user) {
				if (user) {
					var message = ex.messages.registration.usernameTaken;
					err = new Error(message);
					return cb(err);
				}
				return cb(err);
			});
		},
		function (cb) {
			u.save(function (err) {
				if (err) return cb(err);
				//console.log("User created: " + email + " [" + new Date() + "]");
				return cb();
			});
		}
	], function (err) {
        if (err) return cb(err);
        return cb(err, u);
    });
};

ex.authenticate = function(username, password, cb) {
	models.User.findOne({username: username}, function (err, user) {
		if (err) return cb(new Error(err));
		if (!user) return cb(err, null, ex.messages.authentication.incorrectUsername + ": " + username);

		var isValid = bcrypt.compareSync(password, user.pw_hash);
		if (!isValid) {
			return cb(err, null, "Incorrect password.");
		}

		return cb(err, user);
	});
};

ex.getById = function (user_id, cb) {
	models.User.findOne({_id: user_id}, function (err, user) {
        if (err) return cb(err);
        if (!user) return cb(new Error(ex.messages.user.invalidId));
		return cb(err, user);
	});
};

function hashPassword(password) {
	var hash = bcrypt.hashSync(password, 10);
	return hash;
};

module.exports = ex;
