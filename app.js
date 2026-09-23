const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();
const indexRouter = require("./routes/index-router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set EJS as the view engine
app.set("view engine", "ejs");

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
