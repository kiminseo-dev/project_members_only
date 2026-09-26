const { Router } = require("express");
const messageRouter = Router();
const messageController = require("../controllers/message-controller");

messageRouter.get("/", messageController.getMessages);

messageRouter.get("/new", messageController.getNewMessagePage);
messageRouter.post("/new", messageController.createMessage);

messageRouter.get("/delete/:id", messageController.deleteMessage)

module.exports = messageRouter;