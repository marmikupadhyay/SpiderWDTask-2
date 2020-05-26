const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/panel", ensureAuthenticated, (req, res) => {
  res.render("userpanel", { user: req.user });
});

module.exports = router;
