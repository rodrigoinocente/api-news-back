import { Router } from "express";
const route = Router();
import newsPublicController from "../controllers/newsPublic.controller";
import { validateAndConvertIds } from "../middlewares/global.middlewares";


route.get("/findAll", newsPublicController.findAllNews);
route.get("/category/:category", newsPublicController.findNewsByCategory);
// route.get("/top", newsController.topNews);
route.get("/id/:newsId", validateAndConvertIds, newsPublicController.findNewsById);
route.get("/search", newsPublicController.searchNewsByTitle);
route.get("/newsByJournalist/:journalistId", validateAndConvertIds, newsPublicController.newsByJournalist);
route.get("/journalist/:journalistId", validateAndConvertIds, newsPublicController.findJournalist);

export default route;   