var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    nodeMailer = require("nodemailer"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    session = require("express-session"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    Blog = require("./models/blogpost"),
    Email = require("./models/email");

// const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://andrew:Bonjovi1@cluster0-xt2mp.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useUnifiedTopology: true });

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true, useNewUrlParser: true
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.use(session({
    secret: "Bear is the best and cutest dog in the world.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// var emailSchema = new mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     email: String,

// });

// var Email = mongoose.model("Email", emailSchema);

// Email.create({
//     firstName: "Tim",
//     lastName: "Dragon",
//     email: "adorgan@gmail.com"
// });

// Email.create({
//     firstName: "Wendy",
//     lastName: "Zhang",
//     email: "dorgana@oregonstate.edu"
// });

var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adorgandorgan@gmail.com',
        pass: 'Bonjovi1'
    }
});

//   Email.find({}).forEach(function(email){
//             var mailOptions = {
//                 from: 'adorgan@gmail.com',
//                 to: email.email,
//                 subject: 'Sending Email using Node.js',
//                 text: 'Hello ' + email.firstName + ', that was easy!'
//               };
//               transporter.sendMail(mailOptions, function(error, info){
//                 if (error) {
//                   console.log(error);
//                 } else {
//                   console.log('Email sent: ' + info.response);
//                 }
//               });
//         });


//   var mailOptions = {
//     from: 'adorgan@gmail.com',
//     to: Email.find,
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });


//Routes

// app.get("/", function (req, res) {
//     res.redirect("/blogs");
// });






//INDEX
app.get("/", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

app.get("/about", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("about", { blogs: blogs });
        }
    });
});

app.get("/subscribe", function (req, res) {
    res.render("subscribe", { msg: "" });
});

app.get("/privacy", function (req, res) {
    res.render("privacy");
});

app.post("/subscribe", function (req, res) {
    //remove script tags
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Email.create(req.body.email, function (err, newEmail) {
        if (err) {
            res.render("new");
        }
        else {
            var mailOptions = {
                from: 'adorgan@gmail.com',
                to: newEmail.email,
                subject: 'Thanks for signing up for the Pod Walker',
                text: 'Hey ' + newEmail.firstName + ', that was easy! You are now signed up to receive notifications when new Pod Walker episodes are published.'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            var msgSuccess = "Thank you for subscribing!";
            res.render("partials/subscribe_success", { msg: msgSuccess });
        }
    })
});

app.get("/playlists", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("playlists", { blogs: blogs });
        }
    });

});

app.get("/episodes", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("episodes", { blogs: blogs });
        }
    })

});

app.get("/.well-known/acme-challenge/FPVtfyCjk8Hy1uJs1q_X1Q_gHV4KaoZv2v8D_uu-DvE", function (req, res) {
    res.send("FPVtfyCjk8Hy1uJs1q_X1Q_gHV4KaoZv2v8D_uu-DvE.Wwy0GPeoPczoZOkzxI1f_DBgIq-uPuXn1aVYeWF9uiE");
});

//NEW ROUTE
app.get("/admin/episodes/new", isLoggedIn, function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/admin/episodes/new", function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {

            Email.find({}, function (err, emailArray) {
                emailArray.forEach(function (email) {
                    var mailOptions = {
                        from: 'adorgan@gmail.com',
                        to: email.email,
                        subject: 'New Pod Walker Episode',
                        // 
                        html: "<div style='color:black;'>Hey "+email.firstName+",</div><div style='color: black'>Check out the newest episode of the Pod Walker below.</div><br><div><a href='https://podwalker.herokuapp.com/episodes/"+newBlog._id+"'style='padding: 5px; text-decoration:none;color:black;'><div>Episode "+newBlog.episodeNum+"</div><div><strong>" + newBlog.title + "</strong></div><img style='width:350px;margin-top:0px;padding-top:0px;'src="+newBlog.image+"></a></div><br><br><br><div><a style='text-decoration:none;color:blue;' href='www.podwalker.com/unsubscribe'>Unsubscribe</a></div>"
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
            res.redirect("/admin/episodes");
        }
    });
});


//SHOW ROUTE
app.get("/episodes/:id", function (req, res) {
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

//EDIT ROUTE
app.get("/admin/episodes/:id/edit", isLoggedIn, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/admin/episodes");
        }
        else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//UPDATE ROUTE
app.put("/admin/episodes/:id", isLoggedIn, function (req, res) {
    //remove script tags
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/");
        }
        else {
            res.redirect("/admin/episodes/");
        }
    })
});

//DELETE ROUTE
app.delete("/admin/episodes/:id", isLoggedIn, function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/admin/episodes/");
        }
        else {
            res.redirect("/admin/episodes/");
        }
    });
});


//ADMIN LOGIN
app.get("/admin/login", function (req, res) {
    res.render("adminlogin");
});

app.post("/admin/login", passport.authenticate("local", {
    successRedirect: "/admin/episodes",
    failureRedirect: "/admin/login"

}), function (req, res) {

});

//ADMIN EPISODES
app.get("/admin/episodes", isLoggedIn, function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("adminepisodes", { blogs: blogs });
        }
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/admin/login");
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server is running");
});