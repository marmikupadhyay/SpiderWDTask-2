const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Post = require("../models/Post");
const User = require("../models/User");

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
      req.flash("error_msg", "Fill All fields");
      res.redirect("/user/panel");
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
router.post("/edit:id", ensureAuthenticated, (req, res) => {
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
      req.flash("error_msg", "Fill All fields");
      res.redirect("/user/panel");
    });
});

//From the Search Bar
router.post("/panel", ensureAuthenticated, (req, res) => {
  res.redirect(`/user/panel/${req.body.search}`);
});

//Handling Other User Requests
router.get("/panel/:name", ensureAuthenticated, (req, res) => {
  //Finding the user with the given name
  User.findOne({ username: req.params.name })
    .then(otherUser => {
      //If user doesnt exist
      if (!otherUser) {
        res.render("404", { user: req.user });
      } else {
        //Check if its same user
        if (req.user._id.equals(otherUser._id)) {
          res.redirect("/user/panel"); //Redirects to panel
        } else {
          //If user exists and is diffrent then finding all his posts
          Post.find({ authorName: req.params.name })
            .sort("-date")
            .then(userPosts => {
              var currentPost = {};
              res.render("otherUser", {
                user: otherUser,
                viewer: req.user,
                allPosts: userPosts, //sending all posts
                userPosts, //sending user specific posts
                currentPost
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
});

//Handling Followers

router.get("/follow:id", ensureAuthenticated, (req, res) => {
  //Adding To followers
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        followers: req.user._id
      }
    }
  )
    .then(user => {
      res.redirect(`/user/panel/${user.username}`);
    })
    .catch(err => {
      console.log(err);
    });

  //Adding to following
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: {
        following: req.params.id
      }
    }
  )
    .then(user => {
      res.redirect(`/user/panel/${user.username}`);
    })
    .catch(err => {
      console.log(err);
    });
});

//Handling Unfollow

router.get("/unfollow:id", ensureAuthenticated, (req, res) => {
  //Removing from followers
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $pull: {
        followers: req.user._id
      }
    }
  )
    .then(user => {
      res.redirect(`/user/panel/${user.username}`);
    })
    .catch(err => {
      console.log(err);
    });

  //Removing from following
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        following: req.params.id
      }
    }
  )
    .then(user => {
      res.redirect(`/user/panel/${user.username}`);
    })
    .catch(err => {
      console.log(err);
    });
});

//Handling Edit Profile
router.post("/edit/profile", ensureAuthenticated, (req, res) => {
  const { username, password, about } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;

      //Set the new hashed password
      var updatedUser = {
        $set: {
          username: username,
          password: hash,
          about: about
        }
      };
      //Find the user with that username
      User.findOne({ username: username })
        .then(user => {
          if (user && !user._id.equals(req.user._id)) {
            // If exists and is not the user themselves redirect
            req.flash("error_msg", "Username Already Taken");
            res.redirect("/user/panel");
          } else {
            //Else update the username
            User.findOneAndUpdate({ _id: req.user._id }, updatedUser)
              .then(user => {
                //Update the posts that have the username to change the author
                Post.updateMany(
                  { author: req.user._id },
                  { authorName: username }
                )
                  .then(posts => {
                    req.flash("success_msg", "Profile Edited");
                    res.redirect("/user/panel");
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
                req.flash("error_msg", "Fill All fields");
                res.redirect("/user/panel");
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});
module.exports = router;
