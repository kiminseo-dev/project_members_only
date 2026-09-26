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

indexRouter.get("/join", indexController.getActivationPage);
indexRouter.post("/join", indexController.activateMembership);

indexRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Something went wrong");
    res.redirect("/");
  });
});

module.exports = indexRouter;
