import mongoose from "mongoose";
import newsService from "../services/news.service.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validNews = async (req, res, next) => {
    try {
        const newsId = req.params.newsId

        if (!isValidObjectId(newsId)) return res.status(400).send({ message: "Invalid ID" });

        const news = await newsService.findByIdService(newsId);
        if (!news) return res.send({ message: "News not found" });

        req.news = news;
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const validComment = async (req, res, next) => {
    try {
        const { dataCommentId, commentId } = req.params;

        if (!isValidObjectId(dataCommentId)) return res.status(400).send({ message: "Invalid ID" });
        if (!isValidObjectId(commentId)) return res.status(400).send({ message: "Invalid ID" });

        const comment = await newsService.findCommentById(dataCommentId, commentId);
        if (!comment) return res.status(404).send({ message: "Comment not found" });

        req.comment = comment;
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const validReply = async (req, res, next) => {
    try {
        let { dataReplyId, replyId } = req.params;
        dataReplyId = new mongoose.Types.ObjectId(String(dataReplyId));
        replyId = new mongoose.Types.ObjectId(String(replyId));

        if (!isValidObjectId(dataReplyId)) return res.status(400).send({ message: "Invalid ID" });
        if (!isValidObjectId(replyId)) return res.status(400).send({ message: "Invalid ID" });

        const reply = await newsService.findReplyById(dataReplyId, replyId);
        if (reply.length === 0) return res.status(404).send({ message: "Reply not found" });

        req.reply = reply;
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

export { validNews, validComment, validReply };
