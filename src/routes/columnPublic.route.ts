import { Router } from "express";
const route = Router();
import columnPublicController from "../controllers/columnPublic.controller";
import { validateAndConvertIds } from "../middlewares/global.middlewares";

route.get("/columnByJournalist/:journalistId", validateAndConvertIds, columnPublicController.columnByJournalist);

export default route;   