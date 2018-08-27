var express = require("express"),
    router  =express.Router(),
    passport    =require("passport"),
    User        =require("../models/user");
    
   router.get("/", function(req, res){
    res.render("landing");
});


     //Register Route
         //Show  Register Form
router.get("/register",function(req,res){
    res.render("register");
});
    //Handling Registeration
router.post("/register",function(req,res){
    var newUser=new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
        //   console.log(err);
           req.flash("error", err.message);
           return res.redirect("/register");
        }
          passport.authenticate("local")(req, res, function(){
           req.flash("success","Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
        });
    });
});
 //Login Route
     //Show  Login Form
router.get("/login",function(req,res){
   res.render("login"); 
});
   //Handling Login
    //  passport.authenticate is a middleware that authenticate users 
    //   by authenticated method include by passport.use(new LocalStrategy(User.authenticate()));
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});
  //Logout Route
router.get("/logout",function(req,res){
   req.logout(); 
   // before redirecting we should place the flash message
   req.flash("success","Logged You Out");
   res.redirect("/campgrounds");
});
module.exports = router;