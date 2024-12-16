import { Router } from "express";
const route = Router();
import columnAdminController from "../controllers/columnAdmin.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { validateAndConvertIds } from "../middlewares/global.middlewares";


route.post("/", authMiddleware, columnAdminController.createColumn);
route.patch("/:columnId", authMiddleware, validateAndConvertIds, columnAdminController.upDateColumn);
route.delete("/deleteColumn/:columnId", authMiddleware, validateAndConvertIds, columnAdminController.eraseColumn);

export default route;