var Campground  = require("../models/campground");
var  Comment    =require("../models/comment");
var middlewareObj={};

middlewareObj.campgroundownership=function(req,res,next){
    if(req.isAuthenticated())
     {
        Campground.findById(req.params.id,function(err,foundCampground){
          if(err){
             req.flash("error","Campground not found");
             res.redirect("back");
          }
          else{
                //we use equals method here bcoz we r cmpring obj and a string. we  can't do it withi ===
              if(foundCampground.author.id.equals(req.user._id)){      //req.user._id will give the currently logged in user's id
                 next();
              }
               else{
                   req.flash("error","You don't have permission to  do that");
                   res.redirect("back");
               }
          }  
       });
    }
    else
    {
      req.flash("error","You need to be logged in to do that");
      res.redirect("back");
    }
}
middlewareObj.commentownership=function (req,res,next){
    if(req.isAuthenticated())
     {
        Comment.findById(req.params.comment_id,function(err,foundComment){
          if(err){
              req.flash("error","Comment not found");
              res.redirect("back");
          }
          else{
                //we use equals method here bcoz we r cmpring obj and a string. we  can't do it withi ===
              if(foundComment.author.id.equals(req.user._id)){      //req.user._id will give the currently logged in user's id
                 next();
              }
               else{
                   req.flash("error","You don't have permission to do that");
                   res.redirect("back");
               }
          }  
       });
    }
    else
    {
      req.flash("error","You need to be logged in to do that");
      res.redirect("back");
    }
}
middlewareObj.isLoggedIn=function(req,res,next){
    //middleware
    if(req.isAuthenticated()){
        return next();
    }
    // before redirecting we should place the flash message
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
}
module.exports=middlewareObj;