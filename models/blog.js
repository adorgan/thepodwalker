var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    image: {type: Array, default: []},
    caption: {type: Array, default: []},
    body: String,
    playlist: String,
    episodeNum: String,
    created: {type: Date, default: Date.now},
    walkImage: String,
    walkDistance: String,
    walkSteps: String,
    walkTime: String
});

module.exports = mongoose.model("Blogpost", blogSchema);