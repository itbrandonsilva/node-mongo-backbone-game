"use strict";

require(['../libs/config.js'], function (config) { 

    config({
        "html": "views/html"
    }, "../libs/");

    require(['app'], function (app) {
       app();
    });
});
