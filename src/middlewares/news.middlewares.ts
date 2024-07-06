import mongoose from "mongoose";
import newsService from "../services/news.service";
import { NextFunction, Request, Response } from "express";
import { ICommentNews, INews, IReplyComment } from "../../custom";

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

const validNews = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const newsId = req.params.newsId

        if (!isValidObjectId(newsId)) return res.status(400).send({ message: "Invalid ID" });

        const news: INews | null = await newsService.findNewsByIdService(newsId);
        if (!news) return res.send({ message: "News not found" });

        res.locals.news = news;
        next();
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

const validComment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { dataCommentId, commentId } = req.params;

        if (!isValidObjectId(dataCommentId)) return res.status(400).send({ message: "Invalid ID" });
        if (!isValidObjectId(commentId)) return res.status(400).send({ message: "Invalid ID" });

        const comment: ICommentNews | null = await newsService.findCommentById(dataCommentId, commentId);
        if (!comment) return res.status(404).send({ message: "Comment not found" });

        res.locals.comment = comment;
        next();
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

const validReply = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        let { dataReplyId, replyId } = req.params;

        if (!isValidObjectId(dataReplyId)) return res.status(400).send({ message: "Invalid ID" });
        if (!isValidObjectId(replyId)) return res.status(400).send({ message: "Invalid ID" });

        const reply: IReplyComment | null = await newsService.findReplyById(dataReplyId, replyId);
        if (!reply) return res.status(404).send({ message: "Reply not found" });

        res.locals.reply = reply;
        next();
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

export { validNews, validComment, validReply };
