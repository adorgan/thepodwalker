var express = require("express");
var router = express.Router();
var Blog = require("../models/blogpost");


//show home page
router.get("/", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            var blogLength = blogs.length;
            var newBLogs = blogs.slice(blogLength-4, blogLength);
            res.render("index", { blogs: newBLogs });
        }
    });
});

//load more episodes
router.get("/loadEpisodes", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            
            var index = blogs.length - (4 + parseInt(req.query.loadIndex));
            var blogStart = index - 3
            if(blogStart < 0){
                blogStart = 0;
            }
            var newBLogs = blogs.slice(blogStart, index);
            res.render("partials/loadEpisodes", { blogs: newBLogs });
        }
    });
});

//show episodes page
router.get("/episodes", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("episodes", { blogs: blogs });
        }
    })

});

//show individual episodes
router.get("/episodes/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/episodes");
            console.log(err);
        }
        else {
            res.render("show", { blog: foundBlog });
        }
    });
});

//show playlists page
router.get("/playlists", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("playlists", { blogs: blogs });
        }
    });
});

//show about page
router.get("/about", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("about", { blogs: blogs });
        }
    });
});

//show privacy policy page
router.get("/privacy", function (req, res) {
    res.render("privacy");
});

module.exports = router;



