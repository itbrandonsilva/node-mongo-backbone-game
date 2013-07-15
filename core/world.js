"use strict";

var cfg 		    = require("../common/config.js");
var async 		    = require("async");
var utils           = require("../common/utils.js");
var ObjectId		= utils.Schema.ObjectId;

var models          = require("../common/models");

var ex = {};
module.exports = ex;

var map;
var hero;
ex.requireCore = function () {
    map = require("./map");
    hero = require("./hero");
};

ex.get = function (world_id, cb) {
	models.World.findOne({_id: world_id}, function (err, world) {
        if (err) return cb(err);
        if (!world) return cb(new Error("Invalid world_id: " + world_id));
		return cb(err, world);
	});
};

ex.getAll = function (cb) {
    models.World.find({}, function (err, worlds) {
        return cb(err, worlds);
    });
};

ex.create = function (settings, cb) {
	var w = new models.World;

    w.settings.start_items      = settings.start_items || ["dagger"];
    w.settings.start_x          = settings.start_x || 0;
    w.settings.start_y          = settings.start_y || 0;

    w.save(function (err) {
		if (err) return cb(err);
		var m = map.generate(w);
		map.save(m, function (err) {
			return cb(err, w);
		});
	});
};

ex.destroy = function (world_id, cb) {
	if (!world_id) return cb("Missing argument.");
	world_id = new ObjectId(world_id.toString());

	async.series([
		function (err) {
			models.Map.remove({world_id: world_id}, cb);

		},
		function (err) {
			models.World.remove({_id: world_id}, cb);
		},
        function (err) {
            return cb();
            hero.removeWorld(world_id, cb);
        }
	], function (err) {
		return cb(err);
	});
};

ex.removeHero = function (h, cb) {

    if (!h.world_id) return cb(new Error("Hero has not been assigned to a world."));
    h.world_id = null;
    h.game = {};
    hero.save(h, cb);

    /*
    hero.get(hero_id, null, function (err, h) {
        if (err) return cb(err);
        if (!h.world_id) return cb(new Error("Hero has not been assigned to a world."));

        h.world_id = null;
        hero.save(h, function (err) {
            return cb(err);
        });
    });
    */

};

ex.heroCount = function (world_id, cb) {
    hero.countAllInWorld(world_id, function (err, count) {
        if (err) return cb(err);
        return cb(err, count);
    }); 
};

ex.addHero = function (h, w, cb) {

    var vars = {};

    async.series([
        function (cb) {

            if (h.world_id) return cb(new Error("Hero has already been assigned to a world."));
            return cb();
        /*
	        hero.get(hero_id, function (err, h) {
		        if (err) return cb(err);
		        if (h.world_id) return cb(new Error("Hero has already been assigned to a world."));
                vars.h = h;
                return cb(err);
            });
        */

        },
        function (cb) {

            return cb();
        /*
		    ex.get(world_id, function (err, w) {
                if (err) return cb(err);
                vars.w = w;
                return cb(err);
            });
        */

        },
        function (cb) {
            ex.heroCount(w.world_id, function (err, count) {
                if (err) return cb(err);
			    if (count >= w.hero_count_limit) return cb(new Error("World is full."));
                return cb(err);
            });
        },
        function (cb) {
			h.world_id = w._id;

            if (!h.game) h.game = {};
            var game = h.game;
            var settings = w.settings;

            game.last_eaten = new Date();
            game.hero_x = settings.start_x;
            game.hero_y = settings.start_y;
            game.items = settings.start_items;
            game.known_tiles = {};

            hero.knownTile(h, h.game.hero_x, h.game.hero_y, function (err, h) {
                if (err) return cb(err);
                hero.save(h, function (err, h) {
                    if (!err) vars.h = h;
                    return cb(err);
                });
			});	
        }
    ], function (err) {
        h = vars.h || h;
        return cb(err, h);
    });
};

ex.moveHero = function (h, x, y, cb) {

    var vars = {};

    async.series([
        function (cb) {

            
            if (!h.world_id) return cb(new Error("This hero has not been assigned to a world")); 
            return cb();
            /*
            hero.get(hero_id, function (err, h) {
                if (err) return cb(err);
                if (!h.world_id) return cb(new Error("This hero has not been assigned to a world")); 
                vars.h = h;
                return cb(err);
            });
            */
        },
        function (cb) {
            ex.get(h.world_id, function (err, w) {
                if (err) return cb(err);
                var tiles = map.adjacentTiles(h.game.hero_x, h.game.hero_y, w.settings.size_x, w.settings.size_y);
                if ( !(tiles[x] && tiles[x][y]) ) return cb(new Error("Invalid tile specified")); 
                vars.w = w;

                h.game.hero_x = x;
                h.game.hero_y = y;

                return cb(err);
            });
        },
        function (cb) {
            hero.knownTile(h._id, x, y, cb);
        }
    ], function (err) {
        hero.save(h, cb);
    });
};
