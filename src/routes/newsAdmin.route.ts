import { Router } from "express";
const route = Router();
import newsAdminController from "../controllers/newsAdmin.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {validateAndConvertIds } from "../middlewares/global.middlewares";


route.post("/", authMiddleware, newsAdminController.createNews);
route.patch("/:newsId", authMiddleware, validateAndConvertIds, newsAdminController.upDateNews);
route.delete("/deleteNews/:newsId", authMiddleware, validateAndConvertIds, newsAdminController.eraseNews);

export default route;