const express = require("express");
const router = express.Router();

router.get("/panel", (req, res) => {
  res.render("userpanel");
});

module.exports = router;
