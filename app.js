const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");

//Connecting to mongodb
mongoose.connect("mongodb://localhost/spider2", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected To Database");
});

db.on("error", err => {
  console.log(err);
});

//INITALIZE APP
const app = express();
//Setting PUBLIC static folder
app.use("/", express.static(path.join(__dirname, "public")));

// Setting Up View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//BODY PARSER
app.use(express.urlencoded({ extended: false }));

//Setting Routes
app.use("/", require("./routes/indexRoutes"));
app.use("/user", require("./routes/userRoutes"));

//Listening TO PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Listening on PORT ${PORT}`));
