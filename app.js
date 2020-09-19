var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    session = require("express-session"),
    mongoose = require("mongoose"),
    express = require("express"),
    passwords = require("./private/passwords"),
    app = express();

var adminRoutes = require("./routes/admin"),
    subscribeRoutes = require("./routes/subscribe"),
    indexRoutes = require("./routes/index"),
    errorRoutes = require("./routes/error");

mongoose.connect("mongodb+srv://andrew:" + process.env.PASSWORD_MONGODB + "@cluster0-xt2mp.mongodb.net/test?retryWrites=true&w=majority", {
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
app.use(methodOverride("_method"));
app.use(session({
    secret: process.env.PASSWORD_SESSION,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
app.use(adminRoutes);
app.use(subscribeRoutes);
app.use(indexRoutes);
app.use(errorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("Server is running");
});