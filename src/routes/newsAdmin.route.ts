import { Router } from "express";
const route = Router();
import newsAdminController from "../controllers/newsAdmin.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
// import {validateAndConvertIds } from "../middlewares/global.middlewares";


route.post("/", authMiddleware, newsAdminController.createNews);
// route.get("/findAll", newsController.findAll);
// route.get("/top", newsController.topNews);
// route.get("/id/:newsId", authMiddleware, validateAndConvertIds, newsController.findById);
// route.get("/search", newsController.searchByTitle);
// route.get("/newsByUser", authMiddleware, newsController.newsByUser);
// route.patch("/:newsId", authMiddleware, validateAndConvertIds, newsController.upDate);
// route.delete("/deleteNews/:newsId", authMiddleware, validateAndConvertIds, newsController.erase);

export default route;