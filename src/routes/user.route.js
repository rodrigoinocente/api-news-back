import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { validId, validUser, validEmail } from "../middlewares/global.middlewares.js";

const route = Router();

route.post("/", validEmail, userController.createUser);
route.patch("/:userId", validId, validEmail, validUser, userController.update);
route.get("/", userController.findAllUser);
route.get("/email/:email", userController.findByEmail);
route.get("/id/:userId", validId, validUser, userController.findById);

export default route;