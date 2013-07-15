"use strict";

var core		= require("../core");
var assert		= require("assert");
var ObjectID	= require("mongodb").ObjectID;

var models      = require("../common/models");

describe("Hero", function () {

	var user_id; 
	before(function (cb) {
		models.User.findOne({}, function (err, user) {
			user_id = user._id;
			return cb();
		});	
	});

    var hero_id;

	describe("#create()", function() {

		it("Should create a hero and return the hero document on success.", function (cb) {
			core.hero.create(user_id, {name: "Fenix"}, function (err, h) {
				assert.equal(undefined, err);
                assert.notEqual(undefined, h._id);
                hero_id = h._id;
				return cb();
			});
		});

		it("The name chosen must be unique.", function (cb) {
			core.hero.create(user_id, {name: "Fenix"}, function (err, h) {
				assert.strictEqual(core.hero.messages.creation.nameInUse, err.message);
                assert.equal(undefined, h);
				return cb();
			});
		});

		it("Should not accept an invalid id.", function (cb) {
			var invalid_id = new ObjectID(new String("123456781234567812345678"));
			core.hero.create(invalid_id, {name: "Fenix"}, function (err) {
				assert.notEqual(undefined, err);
				return cb();
			});
		});


	});

    describe("#knownTile()", function () {
        it("Should require the hero to be assigned to a world.", function (cb) {
            core.hero.get(hero_id, function (err, h) {
                if (err) return cb(err);
                core.hero.knownTile(h, 1, 1, function (err, h) {
                    assert.notEqual(undefined, h);
                    assert.strictEqual(core.hero.messages.world.notAssigned, err.message);
                    return cb();
                });
            });
        });
    });
});
