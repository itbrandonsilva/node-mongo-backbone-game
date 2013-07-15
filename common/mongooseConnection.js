"use strict";

var config      = require("./config.js");
var mongoose    = require("mongoose");

var uri = 'mongodb://' + config.mongo.host + ":" + config.mongo.port + "/" + config.mongo.db;
var conn = mongoose.createConnection(uri);
module.exports = conn;

conn.on("open", function (err) {
    if (err) throw err;

    if (require.main === module) {
        console.log("Mongoose connection open.");
    }
});
