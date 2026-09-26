const passport = require("passport");
const pool = require("../db/pool");
const bcrypt = require("bcrypt");
require("dotenv").config();

function getHomePage(req, res) {
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

function getActivationPage(req, res) {
  res.render("join");
}

async function activateMembership(req, res) {
  if (!req.user) {
    res.redirect("/log-in");
  }

  const code = req.body.code;
  if (code === process.env.MEMBER_CODE) {
    await pool.query(
      `
      UPDATE users
      SET member = true
      WHERE id = $1
    `,
      [req.user.id],
    );
  } else if (code === process.env.ADMIN_CODE) {
    await pool.query(
      `
      UPDATE users
      SET member = true, admin = true
      WHERE id = $1
      `,
      [req.user.id],
    );
  }

  res.redirect("/");
}

module.exports = {
  getHomePage,
  getSignupPage,
  createUser,
  getLoginPage,
  getActivationPage,
  activateMembership,
};
