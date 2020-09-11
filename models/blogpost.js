var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    mainImg: String,
    image: {type: Array, default: []},
    caption: {type: Array, default: []},
    body: String,
    playlist: String,
    podcasts: Number,
    episodeNum: String,
    created: {type: Date, default: Date.now},
    walkImage: String,
    walkDistance: Number,
    walkSteps: Number,
    walkTimeHrs: Number,
    walkTimeMins: Number,
    views: Number
});

module.exports = mongoose.model("Blog", blogSchema);