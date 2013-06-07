"use strict";

var express 	= require('express')
var routes 	= require('./routes')
var user 	= require('./routes/user')
var http 	= require('http')
var path 	= require('path')

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

// all environments
app.set('port', cfg.web.port || process.env.PORT);
app.set('views', __dirname + '/views');
app.engine('hbs', hbs({}));
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({
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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.indexGet);
app.get('/users', user.list);
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
app.get('/user/login', routes.loginGet);
app.get('/user/register', routes.registerGet);
app.post('/user/register', routes.registerPost);

app.get('/hero/list', ensureAuthenticated, routes.heroListGet);
app.get('/hero/create', ensureAuthenticated, routes.heroCreateGet);
app.post('/hero/create', ensureAuthenticated, routes.heroCreatePost);

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/login');
	}
};

console.log("Loading core...");
async.until(
	function () { return core.ready; },
	function (cb) {
		return setTimeout(cb, 100);	
	},
	function () {
		http.createServer(app).listen(app.get('port'), function(){
			console.log("Server initialization complete; running on port " + app.get('port') + ".");
		});
	}
);


