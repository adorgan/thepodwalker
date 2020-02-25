var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    nodeMailer = require("nodemailer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    Blog = require("./models/blogpost");

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
}, () => { console.log("we are connected")}).catch(err => console.log(err));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

// var transporter = nodeMailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'adorgandorgan@gmail.com',
//       pass: 'Bonjovi1'
//     }
//   });
  
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




app.get("/about", function(req,res){
    res.render("about");
})

//INDEX
app.get("/", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("index", { blogs: blogs });
        }
    })

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



//NEW ROUTE
app.get("/episodes/new", function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/", function (req, res) {
    //remove script tags
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/");
        }
    })
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
app.get("/episodes/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/");
        }
        else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    //remove script tags
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/");
        }
        else {
            res.redirect("/episodes/" + req.params.id);
        }
    })
});

//DELETE ROUTE
app.delete("/episodes/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/");
        }
        else {
            res.redirect("/");
        }
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server is running");
});