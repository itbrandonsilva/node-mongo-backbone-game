"use strict";
var ex = {};

ex.mongo = {
	db: "main",
	host: "127.0.0.1",
	port: 27017,
	collections: [
		"user",
		"hero",
		"world",
		"map"
	]
};

ex.web = {
	port: 3000
};

ex.api = {
    port: 3001
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
