"use strict";

var express 	    = require('express')
var routes 	        = require('./routes')
var http            = require('http')
var path            = require('path')

var cfg		= require('../common/config.js');

var passport	= require('passport');
var LocalStrat  = require('passport-local').Strategy;
var cflash	= require('connect-flash');
var CMongo	= require('connect-mongo')(express);
var hbs  	= require('express3-handlebars'); 
var core        = require('../core');
var async	= require('async');

var app = express();

passport.serializeUser(function (user, done) {
	return done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    console.log("ID: " + id);
	core.user.getById(id, function (err, user) {
		return done(err, user);
	});
});

passport.use(new LocalStrat(
	function (username, password, done) {
		core.user.authenticate(username, password, function (err, user, message) {
			if (err) return done(err);
			if (!user) {
				if (!message) message = "Authentication failed for unreported reason.";
				return done(err, user, {message: message});
			}
			console.log(JSON.stringify(user));
			return done(err, user);	
		});
	}
));

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    next();
};

function peekRequest(req, res, next) {
    console.log("\n -- Peek Request: ");
    //console.log(req.user);
    console.log(req.headers);
    console.log("");
    next();
};

function peekResponse(req, res, next) {

    res.json = (function () {
        var original = res.json;

        return function () {
            console.log("\n -- Peek Response: ");
            console.log(JSON.stringify(arguments[0], null, 2));
            return original.apply(this, arguments);
        }
    })();

    next();
};

// all environments
app.set('port', cfg.api.port || process.env.PORT);
app.set('views', __dirname + '/views');
app.engine('hbs', hbs({}));
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(allowCrossDomain);
app.use(express.session({
    //cookie: {domain: ""},  // Have the client infer the domain
	secret: "g4m3s3cr3t",
	store: new CMongo({
		db: "main",
		host: cfg.mongo_host,
		port: cfg.mongo_port,
		collection: "sessions"
	})
}));
app.use(cflash());
app.use(passport.initialize());
app.use(passport.session());
app.use(peekRequest);
app.use(peekResponse);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.indexGet);

app.post('/login', routes.user.login);
app.get('/logout', routes.user.logout);
app.get('/isloggedin', routes.user.isLoggedIn);

/*
app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return res.send("ERROR(BAD KIND)");
		if (!user) {
			req.flash('error', info.message);
			//return res.redirect('/login')
			return res.send("ERROR(OK KIND): " + info.message);
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			//return res.redirect('/users/' + user.username);
			return res.send("SUSSESS!");
		});
	})(req, res, next);
});
*/

app.get('/user', routes.user.getUser);
app.get('/user/login', routes.loginGet);
app.post('/user/register', routes.user.registerPost);

app.get('/hero/list', ensureAuthenticated, routes.heroListGet);
app.get('/hero/create', ensureAuthenticated, routes.heroCreateGet);
app.post('/hero/create', ensureAuthenticated, routes.heroCreatePost);

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated() && req.user) {
		return next();
	} else {
        var ro = {};
        ro.status = "BadRequestError";
        ro.error = "User is not logged in.";
		return res.redirect('/login');
	}
};

/*
core.init(function (err) {
	if (err) throw err;
	http.createServer(app).listen(app.get('port'), function(){
		console.log("Server initialization complete; running on port " + app.get('port') + ".");
	});
);
*/

http.createServer(app).listen(app.get('port'), function () {
    console.log("Server initialization complete; running on port " + app.get('port') + ".");
});
