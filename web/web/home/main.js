"use strict";

require.config({
    paths: {
        jquery: '../libs/jquery/jquery-1.10.1.min',
        jquerycookie: '../libs/jquery/jquery.cookie',
        underscore: '../libs/underscore/underscore-min',
        backbone: '../libs/backbone/backbone-min',
        user: 'user',
        html: 'views/html',
        text: '../plugins/text'
    },

    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    }
});

require([
    'app',
    'user'
], function (App, user) {
    App();
});
