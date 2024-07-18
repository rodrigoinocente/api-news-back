import { Router } from "express";
const route = Router();

import newsController from "../controllers/news.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { validNews, validComment, validReply } from "../middlewares/news.middlewares";


route.post("/", authMiddleware, newsController.create);
route.get("/findAll", newsController.findAll);
route.get("/top", newsController.topNews);
route.get("/id/:newsId", authMiddleware, validNews, newsController.findById);
route.get("/search", newsController.searchByTitle);
route.get("/newsByUser", authMiddleware, newsController.newsByUser);
route.patch("/:newsId", authMiddleware, validNews, newsController.upDate);
route.delete("/deleteNews/:newsId", authMiddleware, validNews, newsController.erase);
route.post("/likeNews/:newsId", authMiddleware, validNews, newsController.likeNews);
route.get("/likePage/:newsId", validNews, newsController.getPaginatedLikes);
route.post("/comment/:newsId", authMiddleware, validNews, newsController.addComment);
route.delete("/deleteComment/:dataCommentId/:commentId", authMiddleware, validComment, newsController.deleteComment);
route.get("/commentPage/:newsId", authMiddleware, validNews, newsController.getPaginatedComments);
route.post("/likeComment/:dataCommentId/:commentId", authMiddleware, validComment, newsController.likeComment);
route.post("/reply/:dataCommentId/:commentId", authMiddleware, validComment, newsController.addReplyComment);
route.delete("/deleteReply/:dataReplyId/:replyId", authMiddleware, validReply, newsController.deleteReply);
route.get("/replyPage/:dataCommentId/:commentId", authMiddleware, validComment, newsController.getPaginatedReply);
route.post("/likeReply/:dataReplyId/:replyId", authMiddleware, validReply, newsController.likeReply);


export default route;