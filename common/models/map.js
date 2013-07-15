var utils       = require("../utils.js");
var Schema      = require("./default.js");
var mongoose    = require("mongoose");
var db          = require("../mongooseConnection.js");

var MapSchema = new Schema({
    world_id:           {type: utils.ObjectId},
    grid_x:             {type: Number},
    grid_y:             {type: Number},
    properties:         {type: utils.Mixed}
}, {
    collection: "map",
    strict:     true,
    versionKey: false
});

module.exports = db.model('Map', MapSchema);
