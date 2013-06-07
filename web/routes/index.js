"use strict";

var core	= require("../../core");

var ex = {};

ex.indexGet = function(req, res) {
	res.render('index', {title: 'Express'});
};

ex.loginGet = function(req, res) {
	res.render('login', {title: 'Login'});
};

ex.registerGet = function(req, res) {
	res.render('register', {title: 'Register'});
};

ex.registerPost = function (req, res, next) {
	if (req.body.password != req.body.passwordc) return res.send("PASSWORDS DONT MATCH (DERP)");
	core.user.register(req.body.username, req.body.password, "email@email.com", function(err, message) {
		if (err) return res.send("SERVER SIDE ERROR DURING REGISTRATION PROCESS!");
		if (message) return res.send(message);
                res.send("ACCOUNT CREATED! WOOT!");
         });
};

ex.heroListGet = function (req, res, next) {
	core.hero.get(req.user._id, {}, function (err, heroes) {
		if (err) return res.send(err);
		res.send(JSON.stringify(heroes));
	});
};

ex.heroCreateGet = function (req, res, next) {
	res.render('heroCreate', {title: 'Create Hero'});
};

ex.heroCreatePost = function (req, res, next) {
	console.log(req.user._id);
	core.hero.create(req.user._id, 0, {name: req.body.name}, function (err) {
		if (err) return res.send(err.toString());
		return res.send("SUSSESS! (HERO)");
	});
};

function needsToBeImplemented(req, res, next) {
	return res.send("Needs to be implemented");
};

module.exports = ex;
