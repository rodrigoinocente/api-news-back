import { Router } from "express";
const route = Router();
import newsController from "../controllers/news.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {validateAndConvertIds } from "../middlewares/global.middlewares";


route.post("/", authMiddleware, newsController.create);
route.get("/findAll", newsController.findAll);
route.get("/top", newsController.topNews);
route.get("/id/:newsId", authMiddleware, validateAndConvertIds, newsController.findById);
route.get("/search", newsController.searchByTitle);
route.get("/newsByUser", authMiddleware, newsController.newsByUser);
route.patch("/:newsId", authMiddleware, validateAndConvertIds, newsController.upDate);
route.delete("/deleteNews/:newsId", authMiddleware, validateAndConvertIds, newsController.erase);
route.post("/likeNews/:newsId", authMiddleware, validateAndConvertIds, newsController.likeNews);
route.get("/likePage/:newsId",authMiddleware, validateAndConvertIds, newsController.getPaginatedLikes);
route.post("/comment/:newsId", authMiddleware, validateAndConvertIds, newsController.addComment);
route.delete("/deleteComment/:dataCommentId/:commentId", authMiddleware, validateAndConvertIds, newsController.deleteComment);
route.get("/commentPage/:newsId", authMiddleware, validateAndConvertIds, newsController.getPaginatedComments);
route.post("/likeComment/:dataCommentId/:commentId", authMiddleware, validateAndConvertIds, newsController.likeComment);
route.post("/reply/:dataCommentId/:commentId", authMiddleware, validateAndConvertIds, newsController.addReplyComment);
route.delete("/deleteReply/:dataReplyId/:replyId", authMiddleware, validateAndConvertIds, newsController.deleteReply);
route.get("/replyPage/:dataCommentId/:commentId", authMiddleware, validateAndConvertIds, newsController.getPaginatedReply);
route.post("/likeReply/:dataReplyId/:replyId", authMiddleware, validateAndConvertIds, newsController.likeReply);


export default route;