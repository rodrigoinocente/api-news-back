import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { validUser, validEmail } from "../middlewares/user.middlewares.js";

const route = Router();

route.post("/", validEmail, userController.createUser);
route.patch("/:userId", validEmail, validUser, userController.update);
route.get("/", userController.findAllUser);
route.get("/email/:email", userController.findByEmail);
route.get("/id/:userId", validUser, userController.findById);

export default route;