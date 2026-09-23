const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/index-controller");

indexRouter.get("/", indexController.getHomePage);

indexRouter.get("/sign-up", indexController.getSignupForm);
indexRouter.post("/sign-up", indexController.createUser);

module.exports = indexRouter