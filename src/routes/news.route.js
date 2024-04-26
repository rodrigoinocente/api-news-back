import { Router } from "express";
const route = Router();

import newsController from "../controllers/news.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";


route.post("/", authMiddleware, newsController.create);
route.get("/", newsController.findAll);
route.get("/top", newsController.topNews);
route.get("/id/:id", authMiddleware, newsController.findById);
route.get("/search", newsController.searchByTitle);
route.get("/byUser", authMiddleware, newsController.byUser);
route.patch("/:id", authMiddleware, newsController.upDate);
route.delete("/:id", authMiddleware, newsController.erase);


export default route;