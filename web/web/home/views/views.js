"use strict";

define([
    'views/login/ViewLogin',
    'views/register/ViewRegister',
    'views/about/ViewAbout'
], function () {
    
    var exports = {};

    for (var i in arguments) {
        var view = new arguments[i];
        var name = view.name;
        exports[name] = view; 
    }

    return exports;
});
