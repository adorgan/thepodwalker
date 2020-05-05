var express = require("express");
var router = express.Router();
var passport = require("passport");
var Blog = require("../models/blogpost");
var Email = require("../models/email");
var transporter = require("./mailer");
var Blogpost = require("../models/blog");

//Show admin login page
router.get("/admin/login", function (req, res) {
    res.render("adminlogin");
});

//Verify username/password is correct to login
router.post("/admin/login", passport.authenticate("local", {
    successRedirect: "/admin/episodes",
    failureRedirect: "/admin/login"

    }), function (req, res) {

});

//Show admin console with all episodes
router.get("/admin/episodes", isLoggedIn, function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("adminepisodes", { blogs: blogs });
        }
    })
});

//show new blog post page
router.get("/admin/episodes/new", isLoggedIn, function (req, res) {
    res.render("new");
});

//update database with new episode, send mailer to email list
router.post("/admin/episodes/new", function (req, res) {
    console.log(req.body.blog);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            if(req.body.emailCheck == "on"){
                console.log("check works");
            
            Email.find({}, function (err, emailArray) {
                emailArray.forEach(function (email) {
                    setTimeout(function(){}, 2000);
                    var mailOptions = {
                        from: 'thepodwalker@gmail.com',
                        to: email.email,
                        subject: 'New Pod Walker Episode',
                        html:   "<div style='color:black;'>Hey "+email.firstName+",</div>"+
                                "<div style='color: black'>Check out the newest episode of the Pod Walker below.</div><br>"+
                                "<div><a href='https://thepodwalker.com/episodes/" + newBlog._id+"'style='padding: 5px; text-decoration:none;color:black;'>"+
                                "<div>"+newBlog.episodeNum+"</div>"+ 
                                "<div><strong>" + newBlog.title + "</strong></div>"+
                                "<img style='width:350px;margin-top:0px;padding-top:0px;'src="+newBlog.image[0]+"></a></div>"+
                                "<br><br><br>"+
                                "<div><a style='text-decoration:none;color:blue;' href='https://www.thepodwalker.com/unsubscribe'>Unsubscribe</a></div>"
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                });
            });
        }
            
            res.redirect("/admin/episodes");
        }
    });
});

//Show admin episode edit page
router.get("/admin/episodes/:id/edit", isLoggedIn, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/admin/episodes");
        }
        else {
            if(foundBlog.image.length > 1){
                res.render("edit2", { blog: foundBlog });
            }
            else{
                res.render("edit", { blog: foundBlog });
            }
            
        }
    });
});

//Update the episode listing
router.put("/admin/episodes/:id", isLoggedIn, function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/");
        }
        else {
            res.redirect("/admin/episodes/");
        }
    })
});

//delete blog entry from database
router.delete("/admin/episodes/:id", isLoggedIn, function (req, res) {
    console.log(req.params.id);

    // Blog.findByIdAndRemove(req.params.id, function (err) {
    //     if (err) {
    //         res.redirect("/admin/episodes/");
    //     }
    //     else {
    //         res.redirect("/admin/episodes/");
    //     }
    // });
});

//middleware for ensuring user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/admin/login");
}

module.exports = router;