import { Router } from "express";
import journalistController from "../controllers/journalist.controller";
import { validateAndConvertIds } from "../middlewares/global.middlewares";
import { authMiddleware } from "../middlewares/auth.middlewares";

const route = Router();

route.post("/", authMiddleware, journalistController.creatJournalist);
route.get("/findAll", authMiddleware, journalistController.findAllJournalist);
route.get("/id/:journalistId", authMiddleware, validateAndConvertIds, journalistController.findJournalistById);
route.patch("/:journalistId", authMiddleware, validateAndConvertIds, journalistController.updateJournalist);

export default route;