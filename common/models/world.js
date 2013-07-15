var utils       = require("../utils.js");
var Schema      = require("./default.js");
var mongoose    = require("mongoose");
var db          = require("../mongooseConnection.js");

var WorldSchema = new Schema({
    hero_count_limit:   {type: Number, default: 10},
    history:            [String],
    landmarks:          {type: utils.Mixed},
    settings:           {
        size_x:         {type: Number, default: 10},
        size_y:         {type: Number, default: 10},
        start_items:    {type: utils.Mixed},
        start_x:        {type: Number, default: Math.floor(Math.random()*10)},
        start_y:        {type: Number, default: Math.floor(Math.random()*10)},
        speed:          {type: Number, default: 1} //Otherwise power of 2
    } 
}, {
    collection: "world",
    strict:     true,
    versionKey: false
});

module.exports = db.model('World', WorldSchema);
