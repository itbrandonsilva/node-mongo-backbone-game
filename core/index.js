"use strict";

var ex = {};
module.exports = ex;

var modules = ["user", "map", "hero", "world", "map"];

for (var i in modules) {
    var m = modules[i];
    ex[m] = require("./" + m + ".js");
}        

for (var i in modules) {
    var m = modules[i];
    if (ex[m].requireCore) ex[m].requireCore();
}        

if (require.main === module) {
    console.log("Loaded.");
}
