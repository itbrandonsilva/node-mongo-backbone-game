var utils       = require("../utils.js");
var Schema      = require("./default.js");
var mongoose    = require("mongoose");
var db          = require("../mongooseConnection.js");

var UserSchema = new Schema({
    username:           {type: String},
    pw_hash:            {type: String},
    email:              {type: String, default: "email@email.com"},
}, {
    collection: "user",
    strict:     true,
    safe:       true,
    versionKey: false
});

module.exports = db.model('User', UserSchema);
