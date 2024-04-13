const route = require("express").Router();
const userController = require("../controllers/user.controller");
const {validId, validUser, validEmail} = require ("../middlewares/global.middlewares");

route.post("/", validEmail, userController.create);
route.patch("/:id", validId, validEmail, validUser, userController.update);
route.get("/", userController.findAllUser);
route.get("/email/:email", userController.findByEmail);
route.get("/id/:id", validId, validUser, userController.findById);

module.exports = route;