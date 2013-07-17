define([
    'jquery',
    'underscore',
    'backbone',
    'user',
    'views/views'
], function ($, _, Backbone, user, views) {
    
    var Router = Backbone.Router.extend({
        routes: {
            'logout': 'logoutAction',
            'isloggedin': 'isloggedinAction',
            'register': 'registerAction',
            'about': 'aboutAction',
            '*actions': 'homeAction'
        }
    });

    var initialize = function () {
        var router = new Router();

        router.on('route:logoutAction', function (actions) {
            user.logout(function (err) {
                if (err) console.log(err);
            });
        });

        router.on('route:isloggedinAction', function (actions) {
            user.isLoggedIn(function (err) {
                console.log("IsLoggedIn: " + err);
            });
        });

        router.on('route:homeAction', function (actions) {
            user.isLoggedIn(function (loggedIn) {
                if (loggedIn) return user.directToGame();
                views['ViewLogin'].render();
            });
        });

        router.on('route:aboutAction', function (actions) {
            views['ViewAbout'].render();
        });

        router.on('route:registerAction', function (actions) {
            views['ViewRegister'].render();
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };

});
