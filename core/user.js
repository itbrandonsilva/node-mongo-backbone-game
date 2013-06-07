var db     	= require("../common/mongoConnection.js").client;
var bcrypt 	= require("bcrypt");
var cfg    	= require("../common/config.js");
var async  	= require("async");
var ObjectID	= require("mongodb").ObjectID;

var ex = {};

ex.register = function(username, password, email, cb) {
	var u = {};
	u.username = username;
	u.pw_hash   = hashPassword(password);
	u.email    = email;

	var userCollection;
	var message = null;
	async.series([
		function (cb) {
        		db.collection("user", function (err, collection) {
				userCollection = collection;
				return cb();
			});
		},
		function (cb) {
			userCollection.findOne({username: username}, function (err, user) {
				if (user) {
					message = "Username has already been taken.";
					err = new Error(message);
					err.ignore = true;
					return cb(err);
				}
				return cb(err);
			});
		},
		function (cb) {
			userCollection.insert(u, {safe: false}, function (err) {
				if (err) throw new Error(err);
				console.log("User created: " + email + " [" + new Date() + "]");
				return cb();
			});
		}
	], function (err) {
		if (err && err.ignore) err = null;
		return cb(err, message);
	});
};

ex.authenticate = function(username, password, cb) {
	db.collection ("user", function (err, collection) {
		collection.findOne({username: username}, function (err, user) {
			if (err) return cb(new Error(err));
			if (!user) return cb(err, null, "Incorrect username.");

			var isValid = bcrypt.compareSync(password, user.pw_hash);
			if (!isValid) {
				return cb(err, null, "Incorrect password.");
			}

			return cb(err, user);
		});
	});
};

ex.getById = function (user_id, cb) {
	db.collection("user", function (err, collection) {
		collection.findOne({_id: new ObjectID(user_id)}, function (err, user) {
			return cb(err, user);
		});
	});
};

function hashPassword(password) {
	var hash = bcrypt.hashSync(password, 10);
	return hash;
};

if (cfg.env == "DEV") {
	ex.register("testUser", "testPassword", "testEmail@email.com", function (err, message) {
		console.log("Register message: " + message);
		ex.authenticate("testUser", "wrongPassword", function (err, user) {
			console.log("Wrong password: " + user);
			ex.authenticate("testUser", "testPassword", function (err, user) {
				console.log("Correct password: " + user);
			});
		});
	});
}

module.exports = ex;
