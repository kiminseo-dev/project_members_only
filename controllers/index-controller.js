const passport = require("passport");
const pool = require("../db/pool");
const bcrypt = require("bcrypt");

function getHomePage(req, res) {
  console.log(req.user);
  res.render("index", { user: req.user });
}

function getSignupPage(req, res) {
  res.render("sign-up", { user: null, error: null });
}

async function createUser(req, res) {
  const user = req.body;
  try {
    if (
      !user.first_name ||
      !user.last_name ||
      !user.username ||
      !user.password
    ) {
      return res.status(400).send("All fields are required");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    await pool.query(
      `
    INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)
  `,
      [user.first_name, user.last_name, user.username, hashedPassword],
    );
    res.redirect("/");
  } catch (err) {
    if (err.code === "23505") {
      return res.render("sign-up", {
        user,
        error: "Username is already taken",
      });
    }

    console.error(err);
    res.status(500).send("Something went wrong");
  }
}

function getLoginPage(req, res) {
  res.render("log-in");
}

module.exports = {
  getHomePage,
  getSignupPage,
  createUser,
  getLoginPage,
};
