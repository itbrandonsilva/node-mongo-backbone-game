"use strict";

var cfg             = require("../common/config.js");
var async           = require("async");
var mongoose        = require("mongoose");

var ex 		= {};
module.exports = ex;

ex.Schema       = require("./models/default.js");
ex.Mixed        = mongoose.Schema.Types.Mixed;
ex.ObjectId     = mongoose.Schema.Types.ObjectId;

var models          = require("./models");

ex.wipeDb = function (cb) {
        async.eachSeries(Object.keys(models),
            function (model, cb) {
			    models[model].remove({}, cb);
    		},
            function (err) { 
	    		return cb(err);
            }
        );
};
