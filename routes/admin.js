const express = require("express");
const router = express.Router();
const passport = require("passport");
const Blog = require("../models/blogpost");
const Email = require("../models/email");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const sgMail = require("@sendgrid/mail");

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
});

const storage = new multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    key: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});
var upload = multer({ storage: storage });

//Show admin login page
router.get("/admin/login", function (req, res) {
    res.render("adminlogin");
});

//Verify username/password is correct to login
router.post(
    "/admin/login",
    passport.authenticate("local", {
        successRedirect: "/admin/episodes",
        failureRedirect: "/admin/login",
    }),
    function (req, res) {}
);

//Show admin console with all episodes
router.get("/admin/episodes", isLoggedIn, function (req, res) {
    var context = [];

    const blogs = new Promise((resolve, reject) => {
        Blog.find({}, null, { sort: "created" }, function (err, blogs) {
            if (err) {
                console.log("Error");
            } else {
                // res.render("adminepisodes", { blogs: blogs });
                context.blogs = blogs;
                resolve();
            }
        });
    });

    const email = new Promise((resolve, reject) => {
        Email.find({}, function (err, email) {
            if (err) {
                console.log(error);
            } else {
                context.email = email.length;
                resolve();
            }
        });
    });

    Promise.all([blogs, email]).then((values) => {
        res.render("adminepisodes", context);
    });
});

//show new blog post page
router.get("/admin/episodes/new", isLoggedIn, function (req, res) {
    res.render("new");
});

//update database with new episode, send mailer to email list
router.post(
    "/admin/episodes/new",
    upload.array("blog[image]"),
    function (req, res) {
        var imgArray = [];

        if (req.files.length !== 2) {
            for (var i = 0; i < req.files.length - 1; i++) {
                imgArray.push(req.files[i].location);
            }

            req.body.blog.walkImage = req.files[req.files.length - 1].location;
            req.body.blog.image = imgArray;
        } else {
            imgArray.push(req.files[0].location);
            req.body.blog.walkImage = req.files[1].location;
            req.body.blog.image = imgArray;
        }

        Blog.create(req.body.blog, function (err, newBlog) {
            if (err) {
                res.render("new");
            } else {
                if (req.body.emailCheck == "on") {
                    Email.find({}, "email", function (err, emailObjects) {
                        const emailArray = emailObjects.map((obj) => obj.email);
                        if (err) {
                            console.log(err);
                        } else {
                            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                            const msg = {
                                to: emailArray, // Change to your recipient
                                from: "The Podwalker <tim@thepodwalker.com>", // Change to your verified sender
                                templateId: process.env.TEMPLATE_ID_NEW_EPISODE,
                                dynamic_template_data: {
                                    image: newBlog.image[0],
                                    episodeNum: newBlog.episodeNum,
                                    episodeTitle: newBlog.title,
                                    weblink:
                                        "https://thepodwalker.com/episodes/" +
                                        newBlog._id,
                                },
                            };
                            sgMail
                                .sendMultiple(msg)
                                .then(() => {
                                    console.log("Email sent");
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        }
                    });
                }

                res.redirect("/admin/episodes");
            }
        });
    }
);

//Show admin episode edit page
router.get("/admin/episodes/:id/edit", isLoggedIn, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/admin/episodes");
        } else {
            if (foundBlog.image.length > 1) {
                res.render("editMultiPic", { blog: foundBlog });
            } else {
                res.render("editSinglePic", { blog: foundBlog });
            }
        }
    });
});

//Update the episode listing
router.put("/admin/episodes/:id", isLoggedIn, function (req, res) {
    Blog.findByIdAndUpdate(
        req.params.id,
        req.body.blog,
        function (err, updatedBlog) {
            if (err) {
                res.redirect("/");
            } else {
                res.redirect("/admin/episodes/");
            }
        }
    );
});

//delete blog entry from database
router.delete("/admin/episodes/:id", isLoggedIn, function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/admin/episodes/");
        } else {
            res.redirect("/admin/episodes/");
        }
    });
});

//middleware for ensuring user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/admin/login");
}

module.exports = router;
