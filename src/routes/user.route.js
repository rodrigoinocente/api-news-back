import express from "express";
import userController from "../controllers/user.controller.js";
import {validId, validUser, validEmail} from "../middlewares/global.middlewares.js";

const route = express.Router();

route.post("/", validEmail, userController.create);
route.patch("/:id", validId, validEmail, validUser, userController.update);
route.get("/", userController.findAllUser);
route.get("/email/:email", userController.findByEmail);
route.get("/id/:id", validId, validUser, userController.findById);

export default  route;