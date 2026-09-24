const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/index-controller");
const passport = require("passport");

indexRouter.get("/", indexController.getHomePage);

indexRouter.get("/sign-up", indexController.getSignupPage);
indexRouter.post("/sign-up", indexController.createUser);

indexRouter.get("/log-in", indexController.getLoginPage);
indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  }),
);

module.exports = indexRouter;
