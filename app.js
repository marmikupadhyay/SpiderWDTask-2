const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

//INITALIZE APP
const app = express();
//Setting PUBLIC static folder
app.use("/", express.static(path.join(__dirname, "public")));

// Setting Up View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//Setting Routes
app.use("/", require("./routes/indexRoutes"));

//Listening TO PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Listening on PORT ${PORT}`));
