"use strict";

require(['../libs/config.js'], function (config) {

    config({
        "threejs": "{libpath}threejs/build/three.min",
        "statsjs": "{libpath}statsjs/build/stats.min",
        "html": "views/html"
    }, "../libs/");

    require(['app'], function (app) {
        app();
    });
});
