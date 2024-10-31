import { Router } from "express";
import userController from "../controllers/user.controller";
import { validateAndConvertIds } from "../middlewares/global.middlewares";
import { authMiddleware } from "../middlewares/auth.middlewares";

const route = Router();

route.post("/", userController.createUser);
route.patch("/:userId", authMiddleware, validateAndConvertIds, userController.update);
route.get("/findAll", authMiddleware, userController.findAllUser);
route.get("/email/:email", authMiddleware, userController.findByEmail);
route.get("/id/:userId", authMiddleware, validateAndConvertIds, userController.findById);

export default route;
