var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    playlist: String,
    episodeNum: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Blog", blogSchema);