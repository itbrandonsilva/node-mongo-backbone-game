
/**
 * Module dependencies.
 */

var fs          = require("fs");
var async       = require("async");
var express     = require('express');
var http        = require('http');
var path        = require('path');
var hbs         = require('express3-handlebars');

var app         = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', hbs({}));
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('*', function (req, res) {

    if (req.route.params == "/" || req.route.params == "/index") return res.sendfile("./web/views/index.html");
    if (req.route.params == "/game") return res.sendfile("./web/views/game.html");

    var file;
    async.series([
        function (cb) {
            file = "./web" + req.route.params;
            fs.exists(file, cb);
        },
        function (cb) {
            file = "./web/views" + req.route.params;
            fs.exists(file, cb);
        },
        function (cb) {
            file += ".html";
            fs.exists(file, cb);
        }
    ], function (exists) {
        if (exists) return res.sendfile(file);
        return res.send(404, "Not Found");
    });

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
