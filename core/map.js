"use strict";

var cfg 		= require("../common/config.js");
var async 		= require("async");

var world       = require("./world.js");

var models      = require("../common/models");

var ex = {};
module.exports = ex;

ex.generate = function(world) {
    var world_id = world._id;
    
	var xSize = cfg.map.startingXsize; 
	var ySize = cfg.map.startingYsize; 

	var possibleTiles = cfg.map.possibleTiles;

	var m = {};
    m.tiles = {};

    var map = m.tiles;
	for (var x = 0; x < xSize; ++x) {
		if (!map[x]) map[x] = {};
		for (var y = 0; y < ySize; ++y) {
			if (!map[x][y]) map[x][y] = {};
			var tileIndex = Math.floor(Math.random()*(possibleTiles.length-1));			
            
            var t = new models.Map;

		    t.world_id      = world_id,
			t.grid_x        = x,
			t.grid_y        = y,
			t.properties    = {
                terrain_type: possibleTiles[tileIndex]
			}
            map[x][y] = t;
		}
	}

    m.world_id = world_id;
	return(m);	
};

ex.load = function(world_id, cb) {
	var map = {};

	models.Map.find({world_id: world_id}).toArray(function (err, tiles) {
		for (var i = 0, l = tiles.length; i < l; ++i) {
			var t = tiles[i];
			if (!map[t.x]) map[t.x] = {};
			map[t.x][t.y] = t;
		};

        var m = {};
        m.world_id = world_id;
        m.tiles = map;
		return cb(err, m);
	});
};

ex.getTile = function (world_id, x, y, cb) {
    world.get(world_id, function (err, w) {
        if (err) return cb(err);
        models.Map.findOne({world_id: world_id, grid_x: x, grid_y: y}, function (err, t) {
            if (err) return cb(err);
            if (!t) return cb(new Error("Invalid tile."));
            return cb(err, t);
        });
    });
};

ex.saveTile = function (tile, cb) {
    tile.save(function (err, t) {
        if (err) return cb(err);
		return cb(err, t);
    });
};

ex.save = function (map, cb) {

	async.eachSeries(Object.keys(map.tiles),
        function (xKey, cb) {
            async.eachSeries(Object.keys(map.tiles[xKey]),
                function (yKey, cb) {
                    map.tiles[xKey][yKey].save(cb);
                }, cb
            );
        }, cb
    );

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

    var o = {};
    for (var i = 0, l = adjacentTiles.length; i < l; ++i) {
        var x = adjacentTiles[i][0];
        var y = adjacentTiles[i][1];

        if (!o[x])      o[x] = {};
        if (!o[x][y])   o[x][y] = true; 
    }

	return o;
};

if (cfg.env == "DEV") {
    /*
    var x = 5;
    var y = 5;
    console.log("X: " + x + " Y: " + y);
    console.log(JSON.stringify(ex.adjacentTiles(x, y, 10, 10), null, 2));
    */
}
