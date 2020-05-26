const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

const { ensureAuthenticated } = require("../config/auth");

router.get("/panel", ensureAuthenticated, (req, res) => {
  Post.find({})
    .sort("-date")
    .then(allPosts => {
      Post.find({ author: req.user._id })
        .then(userPosts => {
          res.render("userpanel", {
            user: req.user,
            allPosts,
            userPosts
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

module.exports = router;
