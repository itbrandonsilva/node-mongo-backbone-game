var cfg		= require("../common/config.js");
cfg.mongo.db	= "test";

var core	= require("../core");
var utils	= require("../common/utils.js");
var assert	= require("assert");
var async	= require("async");

before(function (cb) {
    utils.wipeDb(cb);
});

describe("Game", function (cb) {
	require("./user.js");
	require("./hero.js");
	require("./world.js");
});
