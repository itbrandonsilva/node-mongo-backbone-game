"use strict";

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    var Session = Backbone.Model.extend({

        login: function (username, password, cb) {

            var req = $.post('http://127.0.0.1:3001/login', {
                username: username,
                password: password
            }, function (data) {
                return cb(null, data);
            })
            .fail(function () {
                return cb(new Error("Error making request to server."));
            });
        },
        
        logout: function (cb) {
            
            var req = $.get('http://127.0.0.1:3001/logout',
            function (res) {
                return cb();
            })
            .fail(function () {
                return cb(new Error("Error making request to server."));
            });
        },

        isLoggedIn: function (cb) {
            var req = $.ajax({
                type: "GET",
                url: 'http://127.0.0.1:3001/isloggedin',
                success: function (res) {
                    return cb(res.data);
                },
                
                fail: function () {
                    return cb(new Error("Error making request to server."));
                }
            });
        },

        directToGame: function () {
            window.location.assign("/game");
        },

        register: function (username, password, cb) {
            var req = $.ajax({
                type: "POST",
                url: 'http://127.0.0.1:3001/user/register',
                data: {
                    username: username,
                    password: password
                },
                success: function (res) {
                    var err;
                    if (res.status != "Ok") {
                        if (!res.message) err = new Error("Unknown server side error.");
                        else err = new Error(res.message); 
                    }
                    return cb(err);
                },
                fail: function () {
                    return cb(new Error("Error making request to server."));
                }
            });
        }
    });

    return new Session;
});
