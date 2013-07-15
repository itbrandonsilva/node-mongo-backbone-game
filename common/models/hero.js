var utils       = require("../utils.js");
var Schema      = require("./default.js");
var mongoose    = require("mongoose");
var db          = require("../mongooseConnection.js");

var HeroSchema = new Schema({
    name:           {type: String   , default: "John Doe"},
    specialty:      {type: String   , default: "none"},
    race:           {type: String   , default: "Human"},
    user_id:        {type: utils.ObjectId},
    world_id:       {type: utils.ObjectId},
    game:           {
        last_action:    {type: Date},
        last_eaten:     {type: Date},
        health:         {type: Number},
        hero_x:         {type: Number},
        hero_y:         {type: Number},
        items:          {type: utils.Mixed},
        known_tiles:    {type: utils.Mixed}
    } 
}, {
    collection: "hero",
    strict:     true,
    versionKey: false
});

module.exports = db.model('Hero', HeroSchema);
