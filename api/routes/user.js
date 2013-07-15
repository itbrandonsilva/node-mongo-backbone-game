"use strict";

var passport = require("passport");
var core     = require("../../core");

var ex = {};
module.exports = ex;

ex.login = function (req, res, next) {
	passport.authenticate('local', function(err, user, info) {

        var ro = {};

		if (err) {
            ro.status = "ServerError";
            ro.error = err.message;
        } else if (!user) {
			req.flash('error', info.message);
            ro.status = "BadRequestError";
            ro.error = info.message;
            ro.message = info.message;
		} 

        if (ro.status) return res.send(ro);

        console.log(user);

        req.logIn(user, function(err) {
			if (err) { 
                return next(err); 
            }
            ro.status = "Ok";
			return res.send(ro);
		});

	})(req, res, next);
};

ex.isLoggedIn = function (req, res, next) {
    var ro = {};
    ro.status = "Ok";
    if (req.user) {
        ro.message = "User is logged in.";
        ro.data = true;
    } else {
        ro.message = "User is not logged in.";
        ro.data = false;
    }
    return res.send(ro);
};

ex.logout = function (req, res, next) {
    var ro = {};
    ro.status = "Ok";
    if (!req.user) ro.message = "No user was logged in.";
    else ro.message = "User was logged out.";
    req.logout();
    return res.send(ro);
};

ex.registerPost = function (req, res, next) {

    var ro = {};

	if (!req.body.username || !req.body.password) {
        ro.status = "BadRequestError";
        ro.error = ro.message = "Must provide both a username and password.";
        return res.send(ro);
    }

	core.user.register(req.body.username, req.body.password, "email@email.com", function (err, user) {
		if (err) {
            ro.status = "ServerError";
            ro.error = ro.message = err.message;
            return res.send(ro);
        }

        ro.status = "Ok";
        ro.message = "Registration complete: " + req.body.username;
        res.send(ro);
    });
};

ex.getUser = function (req, res, next) {
    var ro = {};
    if (!req.user) {
        ro.status = "BadRequestError";
        ro.error  = "User is not logged in.";
    } else {
        ro.status = "Ok";
        var user = req.user.toObject();
        ro.data = user;
    }

    res.send(ro);
};
