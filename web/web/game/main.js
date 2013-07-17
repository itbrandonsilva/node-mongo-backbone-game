"use strict";

require(['../libs/config.js'], function (config) {

    config({
        "threejs": "{prefix}threejs/build/three.min",
        "statsjs": "{prefix}statsjs/build/stats.min",
        "html": "views/html"
    }, "../libs/");

    require(['app'], function (app) {
        app();
    });
});
