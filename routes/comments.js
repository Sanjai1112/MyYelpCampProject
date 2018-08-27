var express = require("express"),
    router  =express.Router({mergeParams:true}),
    Campground  =require("../models/campground"),
    Comment    =require("../models/comment");
var middleware  = require("../middleware");
//==================
//comments routes
//requesting new comment creation
router.get("/new",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
     if(err){
         console.log(err);
        } 
     else{
          res.render("comments/new",{campground:campground});       
     }
  });
   
});
   //creating comments by post request
router.post("/",middleware.isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           req.flash("error","Something went wrong");
           console.log(err);
       }else
       {
         Comment.create(req.body.comment,function(err,comment){
             if(err){
                 req.flash("error","Something went wrong");
                 console.log(err);
             }
             else{
                 //add username and id to comment
                 comment.author.id=req.user._id;
                 comment.author.username=req.user.username;
                 //save comment
                 comment.save();
                 campground.comments.push(comment);
                 campground.save();
                 req.flash("success","Successfully added a comment");
                 res.redirect("/campgrounds/"+campground._id);
             }
         });
       }
   }) ;
});
  //Edit comment
router.get("/:comment_id/edit",middleware.commentownership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            res.redirect("back");
        }
        else{
           res.render("comments/edit",{campground_id:req.params.id,comment:foundcomment}); 
        }
    });
});
   //update comment
  router.put("/:comment_id",middleware.commentownership,function(req,res){
      Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
         if(err){
             req.flash("error","Something  went wrong,Try again later");
             res.redirect("back");
         } else{
             req.flash("success","Comment successfully updated");
             res.redirect("/campgrounds/"+req.params.id);
         }
      });
  });
  //Deleting a comment
  router.delete("/:comment_id",middleware.commentownership,function(req,res){
       Comment.findByIdAndRemove(req.params.comment_id,function(err,deletedcomment){
       if(err){
           req.flash("error","Something went wrong, try again later");
           res.redirect("back");
       }
       else{
           req.flash("success","Successfully deleted that comment");
           res.redirect("/campgrounds/"+req.params.id);
       }
   }) ; 
 });


module.exports = router;