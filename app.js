const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config();
const pgSession = require("connect-pg-simple")(session);

const pool = require("./db/pool");

const PORT = process.env.PORT || 3000;

const app = express();
const indexRouter = require("./routes/index-router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set EJS as the view engine
app.set("view engine", "ejs");

app.use(
  session({
    store: new pgSession({ pool: pool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await pool.query(
        `
        SELECT * FROM users
        WHERE username = $1
      `,
        [username],
      );

      const user = result.rows[0];
      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// user -> user id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// user id -> user
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users 
      WHERE id = $1
    `,
      [id],
    );
    const user = result.rows[0];

    done(null, user);
  } catch (err) {
    return done(err);
  }
});

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
