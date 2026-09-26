const { Router } = require("express");
const messageRouter = Router();
const messageController = require("../controllers/message-controller");

messageRouter.get("/", messageController.getMessages);

messageRouter.get("/new-message", messageController.getNewMessagePage);
messageRouter.post("/new-message", messageController.createMessage);

module.exports = messageRouter;