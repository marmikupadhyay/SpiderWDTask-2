const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

const { ensureAuthenticated } = require("../config/auth");

//Get Request to Main Panel
router.get("/panel", ensureAuthenticated, (req, res) => {
  Post.find({}) //Finding all the posts
    .sort("-date")
    .then(allPosts => {
      //Finding posts to the specific user
      Post.find({ author: req.user._id })
        .sort("-date")
        .then(userPosts => {
          var currentPost = {};
          res.render("userpanel", {
            user: req.user,
            allPosts, //sending all posts
            userPosts, //sending user specific posts
            currentPost
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

//Handleing Post addition
router.post("/add", ensureAuthenticated, (req, res) => {
  const { title, body } = req.body;
  const newPost = new Post({
    title,
    body,
    author: req.user._id,
    authorName: req.user.username
  });
  newPost
    .save()
    .then(post => {
      req.flash("success_msg", "Post Created");
      res.redirect("/user/panel");
    })
    .catch(err => {
      console.log(err);
    });
});

//Handling Post Deletion
router.get("/delete:id", ensureAuthenticated, (req, res) => {
  Post.findOneAndDelete({ _id: req.params.id })
    .then(post => {
      req.flash("success_msg", "Post Deleted");
      res.redirect("/user/panel");
    })
    .catch(err => {
      err;
    });
});

//Handling post editing
router.post("/edit:id", (req, res) => {
  const { title, body } = req.body;
  var updatedPost = {
    $set: {
      title,
      body,
      author: req.user._id,
      authorName: req.user.username,
      date: Date.now()
    }
  };
  Post.findOneAndUpdate({ _id: req.params.id }, updatedPost)
    .then(post => {
      req.flash("success_msg", "Post Edited");
      res.redirect("/user/panel");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
