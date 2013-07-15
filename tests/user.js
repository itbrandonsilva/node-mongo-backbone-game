"use strict";

var core	= require("../core");
var assert	= require("assert");

describe("User", function () {

	describe("#register()", function() {

		it("Should register a user.", function (cb) {
			core.user.register("testUser", "testPassword", "testEmail@email.com", function (err, user) {
				assert.equal(undefined, err);
                assert.notEqual(undefined, user);
				return cb();
			});
		});

		it("Should not allow duplicate usernames", function (cb) {
			core.user.register("testUser", "testPassword", "testEmail@email.com", function (err, user) {
				assert.strictEqual(core.user.messages.registration.usernameTaken, err.message);
                assert.equal(undefined, user);
				return cb();
			});
		});

	});

	describe("#authenticate()", function () {

		it("Should authenticate valid user credentials.", function (cb) {
			core.user.authenticate("testUser", "testPassword", function (err, user, message) {
				assert.equal(undefined, err);
				assert.notEqual(undefined, user);
				assert.equal(undefined, message);
				return cb();
			});
		});

		it("Should report when the username is invalid.", function (cb) {
    
            var invalidUsername = "invalidUser";
			core.user.authenticate(invalidUsername, "testPassword", function (err, user, message) {
				assert.equal(undefined, err);
				assert.equal(undefined, user);
				assert.equal(core.user.messages.authentication.incorrectUsername + ": " + invalidUsername, message);
				return cb();
			});
		});

		it("Should report when the password is incorrect.", function (cb) {
			core.user.authenticate("testUser", "incorrectPassword", function (err, user, message) {
				assert.equal(undefined, err);
				assert.equal(undefined, user);
				assert.equal(core.user.messages.authentication.incorrectPassword, message);
				return cb();
			});
		});
	});
});
