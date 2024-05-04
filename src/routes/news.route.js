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
route.patch("/like/:id", authMiddleware, newsController.likeNews);
route.patch("/like/:id", authMiddleware, newsController.likeNews);
route.patch("/like/:id/:idComment", authMiddleware, newsController.likeComment);
route.patch("/comment/:id", authMiddleware, newsController.addComment);
route.patch("/comment/:id/:idComment", authMiddleware, newsController.deleteComment);
route.patch("/reply/:id/:idComment", authMiddleware, newsController.addReplyToComment);
route.patch("/reply/:id/:idComment/:idReply", authMiddleware, newsController.deleteReply);


export default route;