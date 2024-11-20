import { Router } from "express";
import journalistController from "../controllers/journalist.controller";
// import { validateAndConvertIds } from "../middlewares/global.middlewares";
import { authMiddleware } from "../middlewares/auth.middlewares";

const route = Router();

route.post("/", authMiddleware, journalistController.creatJournalist);
route.get("/findAll", authMiddleware, journalistController.findAllJournalist);
// route.patch("/:userId", authMiddleware, validateAndConvertIds, userController.update);
// route.get("/email/:email", authMiddleware, userController.findByEmail);
// route.get("/id/:userId", authMiddleware, validateAndConvertIds, userController.findById);
// route.get("/me/", authMiddleware, userController.getLoggedInUser);

export default route;