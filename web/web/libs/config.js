"use strict";

var config = {

    paths: {
        jquery: 'jquery/jquery.min',
        underscore: 'underscore/underscore-min',
        backbone: 'backbone/backbone-min',
        text: 'text/text'
    },
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    }

};

function prefixPaths(prefix, all) {
    if (!prefix) return;
    var paths = config.paths;
    Object.keys(paths).forEach(function (p) {

        if (all) paths[p] = prefix + paths[p];
        else paths[p] = paths[p].replace("{libpath}", prefix);

    });
};

function addPaths(paths) {
    if (!paths) return;
    Object.keys(paths).forEach(function (p) {
       config.paths[p] = paths[p];
    });
};

define([], function () {
    return function (paths, libpath) {

        prefixPaths(libpath, true);
        addPaths(paths);
        prefixPaths(libpath);

        console.log(JSON.stringify(config, null, 2));

        require.config(config);
    };
});
