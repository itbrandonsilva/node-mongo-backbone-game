"use strict";

var db  	= require("../common/mongoConnection.js").client;
var cfg 	= require("../common/config.js");
var async 	= require("async");

var ex = {};

ex.generateMap = function(mapid) {
	var xSize = cfg.map.startingXsize; 
	var ySize = cfg.map.startingYsize; 

	var possibleTiles = cfg.map.possibleTiles;

	var map = [];

	for (var x = 0; x < xSize; ++x) {
		if (!map[x]) map[x] = [];
		for (var y = 0; y < ySize; ++y) {
			if (!map[x][y]) map[x][y] = [];
			var tileIndex = Math.floor(Math.random()*(possibleTiles.length-1));			

			map[x][y] = {
				map_id: mapid,
				x: x,
				y: y,
				terrain_type: possibleTiles[tileIndex]
			}
		}
	}

	return(map);	
};

ex.loadMap = function(mapid, cb) {
	var map = {};

	db.collection("map", function (err, collection) {
		collection.find({map_id: mapid}).toArray(function (err, tiles) {
			for (var i = 0, l = tiles.length; i < l; ++i) {
				var t = tiles[i];
				if (!map[t.x]) map[t.x] = {};
				map[t.x][t.y] = t;
			};
			return cb(err, map);
		});
	});	
};

ex.saveMap = function (map, mapid, cb) {
	db.collection("map", function (err, collection) {
		var packedMap = [];
		for (var i in map) {
			for (var j in map[i]) {
				packedMap.push(map[i][j]);
			}
		}

		async.eachSeries(packedMap,
			function (tile, cb) {
				collection.update({map_id: mapid, x: tile.x, y: tile.y}, tile, {upsert: true}, function (err) {
					return cb(err);
				});
			},
			function (err) {
				return cb(err);
			}
		);
	});
};

ex.adjacentTiles = function(x, y, xLimit, yLimit) {
	//Is x even?
	var yEven = false;
	if (y%2 == 0) yEven = true;
	
	var adjacentTiles = [];	

	if (x > 0) adjacentTiles.push([x-1, y]);
	if (x+1 <= xLimit) adjacentTiles.push([x+1, y]);

	if (y-1 > -1) {
		adjacentTiles.push([x, y-1]);		
		if (yEven && (x-1 > -1)) {
			adjacentTiles.push([x-1, y-1]);		
		} else if (!yEven && (x+1 <= xLimit)) {
			adjacentTiles.push([x+1, y-1]);
		}
	}

	if (y+1 <= yLimit) {
		adjacentTiles.push([x, y+1]);		
		if (yEven && (x-1 > -1)) {
			adjacentTiles.push([x-1, y+1]);		
		} else if (!yEven && (x+1 <= xLimit)) {
			adjacentTiles.push([x+1, y+1]);
		}
	}

	return adjacentTiles;
};

module.exports = ex;

if (cfg.env == "DEV") {
	var mapid = 0;
	var map = ex.generateMap(mapid);
	console.log(ex.adjacentTiles(1, 1, 20, 20));
	console.log(ex.adjacentTiles(2, 2, 20, 20));
	console.log("");

	ex.saveMap(map, mapid, function (err) {
		if (err) throw new Error(err);
		console.log("Test map saved!");
		ex.loadMap(mapid, function (err, map) {
			if (err) throw new Error(err);
			console.log("Test map loaded!");
		});
	});
}
