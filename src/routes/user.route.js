const route = require("express").Router();
const userController = require("../controllers/user.controller");

route.post("/", userController.create);
route.get("/", userController.findAllUser);
route.get("/email/:email", userController.findByEmail);
route.get("/id/:id", userController.findById);
route.patch("/:id", userController.update);

module.exports = route;