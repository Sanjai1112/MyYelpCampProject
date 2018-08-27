var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");
  //Map
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});  
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name ,price:price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit Campgrounds
router.get("/:id/edit",middleware.campgroundownership,function(req, res) {
Campground.findById(req.params.id,function(err,foundCampground){
    if(err){
        req.flash("error","Could not find that campground");
    }
    res.render("campgrounds/edit",{campground:foundCampground});
});
});
  
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.campgroundownership, function(req, res){
 geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

     Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
     if(err){
         req.flash("error","Update failed, Try again later");
         res.redirect("/campgrounds");
     }  else{
          req.flash("success","Campground updated successfully");
         res.redirect("/campgrounds/"+req.params.id);    
     }
   });
  });
});
   //Delete campground
router.delete("/:id",middleware.campgroundownership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err,deletedcampground){
       if(err){
           req.flash("error","Failed to remove, try again later");
           res.redirect("/campgrounds");
       }
       else{
           res.redirect("/campgrounds");
       }
   }) ; 
});

module.exports = router;