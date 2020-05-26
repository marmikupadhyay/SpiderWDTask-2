const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/login", (req, res) => {
  console.log(req.body.username);
  res.redirect("/user/panel");
});

router.post("/signup", (req, res) => {
  let errors = [];
  const { username, mail, pass } = req.body;
  // res.redirect("/login");
  if (!username || !mail || !pass) {
    errors.push({ msg: "Fill All Fields" });
  }

  if (errors.length > 0) {
    res.render("signup", { errors, username, mail, pass });
  } else {
    //Validation Passed
    User.findOne({ username: username })
      .then(user => {
        if (user) {
          errors.push({ msg: "User Already Exists" });
          res.render("signup", { errors, username, mail, pass });
        } else {
          const newUser = new User({
            username,
            email: mail,
            password: pass
          });

          //HASH PASSWORD
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              //Set the new hashed password
              newUser.password = hash;

              //Saving the use to DB
              newUser
                .save()
                .then(user => {
                  res.redirect("/user/panel");
                })
                .catch(err => {
                  console.log(err);
                });
            });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});

module.exports = router;
