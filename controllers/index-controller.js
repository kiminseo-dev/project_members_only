const pool = require("../db/pool");

function getHomePage(req, res) {
  res.render("index");
}

function getSignupForm(req, res) {
  res.render("sign-up");
}

function createUser(req, res) {
  console.log(req.body);
  res.send("sign up completed");
}

module.exports = {
  getHomePage,
  getSignupForm,
  createUser,
};
