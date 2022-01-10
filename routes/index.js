var express = require("express");
var router = express.Router();
var Blog = require("../models/blogpost");
var Blogpost = require("../models/blog");


//show home page
router.get("/", function (req, res) {
    Blog.find({}, null, {sort: 'created'}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {

        res.cookie('foo', 'bar', {
            sameSite: "none",
            secure: true
        });
        
        
        
        var runningTotals;
        Blog.aggregate([
                { $group: {
                    _id: null,
                    totalPodcasts:{ $sum: "$podcasts" },
                    totalWalkDistance: { $sum: "$walkDistance" },
                    totalSteps: { $sum: "$walkSteps" },
                    totalWalkMins: { $sum: "$walkTimeMins" },
                    totalWalkHrs: { $sum: "$walkTimeHrs" }
                }}
        ]).then(function(result){
            
            runningTotals = result;
          
            var blogLength = blogs.length;
            var newBLogs = blogs.slice(blogLength-6, blogLength).reverse();

            var totalMins = (result[0].totalWalkHrs * 60) + result[0].totalWalkMins;
            runningTotals[0].totalWalkHrs = Math.floor(totalMins / 60);
            if(totalMins % 60 < 10){
                runningTotals[0].totalWalkMins = '0' + totalMins % 60;
            }
            else{
                runningTotals[0].totalWalkMins = totalMins % 60;
            }
            
            
            res.render("index", { blogs: newBLogs,
                                totals: runningTotals});
        });
        
            
        }
    });
});

//load more episodes
router.get("/loadEpisodes", function (req, res) {
    Blog.find({}, null, {sort: 'created'}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            
            var index = blogs.length - (6 + parseInt(req.query.loadIndex));
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
    Blog.find({}, null, {sort: '-created'}, function (err, blogs) {
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
            res.redirect("/");
            console.log(err);
        }
        else { 
            
            // increment page view counter in db
            if(foundBlog.views != undefined){
                var numViews = foundBlog.views;
                numViews++;
                Blog.updateOne({ _id: req.params.id}, { views: numViews}, function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        
                        if(foundBlog.image.length > 1){
                
                            res.render("test", { blog: foundBlog });
                        }
                        else{
                            res.render("show", { blog: foundBlog });
                            
                        }
                    }
                });
            }
            else{
                Blog.updateOne({ _id: req.params.id}, { views: 1}, function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(foundBlog.image.length > 1){
                
                            res.render("test", { blog: foundBlog });
                        }
                        else{
                            res.render("show", { blog: foundBlog });
                            
                        }
                    }
                });
            }
         
            
        }
    });
});

//show playlists page
router.get("/playlists", function (req, res) {
    Blog.find({}, null, {sort: 'created'}, function (err, blogs) {
        if (err) {
            console.log("Error"); 
        } else {
            res.cookie('foo', 'bar', {
                sameSite: "none",
                secure: true
            });

            res.render("playlists", { blogs: blogs });
        }
    });
});

//show about page
router.get("/about", function (req, res) {
    Blog.find({}, null, {sort: 'created'}, function (err, blogs) {
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

router.get("/test", function (req, res) {
    res.render("test");
});

module.exports = router;



