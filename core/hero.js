"use strict";

var cfg			    = require("../common/config.js");
var async		    = require("async");
var ObjectID		= require("mongodb").ObjectID;

var models          = require("../common/models");

var ex = {};
module.exports = ex;

var user;
var map;
var hero;
ex.requireCore = function () {
    user    = require("./user.js");
    map     = require("./map.js");
    hero    = require("./hero.js");
};

ex.messages = {
	creation: {
		nameInUse: "A hero with the name chosen already exists."
	},
    world: {
        notAssigned: "This hero has not yet been assigned to a world."
    },
    user: {
        noHeroes: "This user does not have any heroes."
    }   
}

function filterName(name) {
	return true;
};

ex.get = function (hero_id, cb) {
	models.Hero.findOne({_id: hero_id}, function (err, hero) {
        if (err) return cb(err);
        if (!hero) return cb(new Error("Invalid hero_id: " + hero_id));
		return cb(err, hero);
	});	
};

ex.getByName = function (name, cb) {
    models.Hero.findOne({name: name}, function (err, hero) {
        if (err) return cb(err);
        return cb(err, hero);
    });
}

ex.getAllByUserId = function (user_id, cb) {
	user_id = new ObjectID(user_id.toString());

	models.Hero.find({user_id: user_id}, function (err, heroes) {
        if (heroes.length < 1) return cb(new Error(ex.messages.user.noHeroes));
		return cb(err, heroes);
	});
};

ex.save = function (hero, cb) {
    hero.markModified("game.items");
    hero.markModified("game.known_tiles");
    hero.save(cb);
};

ex.getAllInWorld = function (world_id, cb) {
    models.Hero.find({world_id: world_id}, function (err, heroes) {
        return cb(err, heroes);
    });
};

ex.countAllInWorld = function (world_id, cb) {
    models.Hero.find({world_id: world_id}, function (err, heroes) {
        return cb(err, heroes.length);
    });
};


ex.create = function (user_id, d, cb) {	

	if (!user_id || !d.name) return cb(new Error("Missing paramaters."));
	if (!filterName(d.name)) return cb(new Error("Character name specified does not meet the requirements."));

    var vars = {};

	async.series([
		function (cb) {
			user.getById(user_id, function (err, user) {
				if (err) return cb(err);
				if (!user) return cb(new Error("user_id invalid: " + user_id));
				return cb(err);
			});
		},
		function (cb) {
			ex.getByName(d.name, function (err, hero) {
				if (err) return cb(err);
				if (hero) return cb(new Error(ex.messages.creation.nameInUse));

				var h = new models.Hero;
				h.name		= d.name;
				h.specialty	= d.specialty || "None";
				h.race		= d.race || "Human";
				h.user_id	= user_id;

				ex.save(h, function (err, h) {
                    if (err) return cb(err);
                    vars.h = h;
					return cb(err, h);
				});
			});
		}
	], function (err) {
		return cb(err, vars.h);
	});
};

ex.removeWorld = function (world_id, cb) {
    models.Hero.update({world_id: world_id}, {'$set': {world_id: null, game: {}}}, function (err, count) {
        return cb(err);
    });
};

ex.knownTile = function (h, x, y, cb) {

    var vars = {};

    async.series([
        function (cb) {

            if (!h.world_id) return cb(new Error(ex.messages.world.notAssigned));

            return cb();
            /*
            ex.get(hero_id, function (err, h) {
                if (err) return cb(err);
                if (!h.world_id) return cb(new Error(ex.messages.world.notAssigned));
                vars.h = h;
                return cb(err);
            });
            */

        },
        function (cb) {
            map.getTile(h.world_id, x, y, function (err, t) {
                if (err) return cb(err);

                var known_tiles = h.game.known_tiles;
                if (!known_tiles[x]) known_tiles[x] = {};
                if (!known_tiles[x][y]) known_tiles[x][y] = {};
                var knownTile = known_tiles[x][y];        

                knownTile.terrain_type = t.properties.terrain_type;
                return cb(err);
            });
        },
        function (cb) {
            hero.save(h, function (err, h) {
                if (!err) vars.h = h;
                return cb(err);
            });
        }
    ], function (err) {
        h = vars.h || h;
        return cb(err, h);
    });
};

ex.getPossibleActions = function (h, w) {
    var speed = w.settings.speed;
    var game = h.game;

    var possibleActions = {};
    var lastAction = game.last_action;
    var lastEaten = game.last_eaten; 

    var interval    = 1/speed;
    
    var canMove = new Date(lastAction);
    canMove.setHours(canMove.getHours()+(interval*4));
    canMove < lastAction ? canMove = true : canMove = false;
    canMove = true;
    possibleActions["move"] = canMove;

    return possibleActions;
};

