import { Router } from "express";
const route = Router();
import columnPublicController from "../controllers/columnPublic.controller";
import { validateAndConvertIds } from "../middlewares/global.middlewares";

route.get("/columnByJournalist/:journalistId", validateAndConvertIds, columnPublicController.columnByJournalist);
route.get("/columnByCategory/:category", validateAndConvertIds, columnPublicController.columnByCategory);

export default route;   