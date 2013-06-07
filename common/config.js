"use strict";
var ex = {};

ex.mongo_host = "127.0.0.1";
ex.mongo_port = 27017;

ex.web = {
	port: 3000
};

// DEV, PRD
ex.env = "DEV";


/* Game settings */

var map = {};
map.startingXsize = 20;
map.startingYsize = 20;

map.possibleTiles = ["forest", "mountains", "plains", "desert"];
ex.map = map;

var tiles = {}

tiles["forest"] = {};
tiles["mountains"] = {};
tiles["plains"] = {};
tiles["desert"] = {};

ex.tiles = tiles;


module.exports = ex;
