require('dotenv').config();
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    =require("passport"),
    localstrategy=require("passport-local"),
    flash        =require("connect-flash"),
    Campground  =require("./models/campground"),
    Comment     =require("./models/comment"),
    methodOverride =require("method-override"),
    User        =require("./models/user");   
    // seedDB      =require("./seeds");
 //Requiring Routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
// seedDB();
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.locals.moment = require('moment'); 
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.locals.moment = require('moment');  // moments for comment dates created 
    //Passport Configuration
app.use(require("express-session")({
    secret: "sanjai",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname+"/public"));


app.use(function(req, res, next){            //we use this function for passing currentUser value to every other routes otherwise it shows error
 res.locals.currentUser = req.user; //req.user contains info such as about logged user's id username      
 res.locals.error=req.flash("error");
 res.locals.success=req.flash("success");
 next();
});
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});