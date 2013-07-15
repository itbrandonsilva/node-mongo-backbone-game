"use strict";

var core		= require("../core");
var assert		= require("assert");
var models      = require("../common/models");

describe("World", function () {

	var user_id; 
    var hero_id;
    var world_id;
    var w;
    var h;

	before(function (cb) {
		models.User.findOne({}, function (err, user) {
			if (err) return cb(err);
			user_id = user._id;
            core.hero.getAllByUserId(user_id, function (err, heroes) {
                if (err) return cb(err);
                if (!heroes[0]) return cb(new Error("Test hero does not exist."));
                h = heroes[0];
                hero_id = h._id;
                return cb(err);
            });
		});	
	});

	describe("#create()", function () {

		it("Should create a world.", function (cb) {
			core.world.create({start_x: 0, start_y: 0}, function (err, test_world_id) {
                if (err) return cb(err);
                assert.notEqual(undefined, test_world_id);
                world_id = test_world_id;
				assert.equal(undefined, err);
				return cb(err);
			});
		});

    });

    describe("#getAll()", function () {

        it("Should get and return all worlds.", function (cb) {
            core.world.getAll(function (err, worlds) {
                if (err) return cb(err);
                if (!worlds || !worlds[0]) return cb(new Error("No test worlds exists."));
                w = worlds[0];
                return cb(err);
            });
        });

    });

    describe("#addHero()", function () {

        it("Should be able to add heroes to a world.", function (cb) {
            core.world.addHero(h, w, function (err, newh) {
                if (err) return cb(err);
                h = newh;
                return cb(err);
            });
        });

	});

    describe("#moveHero()", function () {

        it("Should be able to move a hero.", function (cb) {
            core.world.moveHero(h, 1, 0, function (err) {
                return cb(err);
            });
        });

    });
});
