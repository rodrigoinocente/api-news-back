import { Router } from "express";
const route = Router();
import columnAdminController from "../controllers/columnAdmin.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";


route.post("/", authMiddleware, columnAdminController.createColumn);

export default route;