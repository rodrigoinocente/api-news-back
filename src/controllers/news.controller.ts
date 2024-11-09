import { INews } from "../../custom";
import newsService from "../services/news.service";
import { Request, Response } from "express"

const create = async (req: Request, res: Response): Promise<Response | void> => {
    const body = req.body;
    const userId = res.locals.userLoggedId;

    try {
        const news: INews = await newsService.createNewsService(body, userId);

        res.status(201).send(news);
    } catch (err: any) {
        if (err.message === "Submit all fields to post")
            return res.status(400).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const findAll = async (req: Request, res: Response): Promise<Response | void> => {
    let limit = req.query.limit ? Number(req.query.limit) : 15;
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    const currentUrl = req.baseUrl;

    try {
        const { nextUrl, previousUrl, total, news } = await newsService.findAllNewsService(offset, limit, currentUrl);

        res.status(200).send({
            nextUrl,
            previousUrl,
            offset,
            total,
            news
        });
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(204).send();

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const topNews = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const news: INews | null = await newsService.topNewsService();

        return res.status(200).send(news);
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(204).send();

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const findById = async (req: Request, res: Response): Promise<Response | void> => {
    const newsId = res.locals.newsId;

    try {
        const news: INews | null = await newsService.findByIdService(newsId);
        return res.status(200).send(news);
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(204).send();

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const searchByTitle = async (req: Request, res: Response): Promise<Response | void> => {
    const { title } = req.query;

    try {
        const news: INews[] | null = await newsService.searchByTitleService(title as string);

        return res.status(200).send(news);
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(204).send();

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const newsByUser = async (req: Request, res: Response): Promise<Response | void> => {
    const userId = res.locals.userLoggedId;

    try {
        const news: INews[] = await newsService.newsByUserService(userId);

        return res.status(200).send(news);
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(204).send();

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const upDate = async (req: Request, res: Response): Promise<Response | void> => {
    const newsId = res.locals.newsId
    const body = req.body;
    const userLoggedId = res.locals.userLoggedId;

    try {
        const news: INews = await newsService.updateNewsService(newsId, body, userLoggedId);

        return res.status(200).send({
            message: "Post successfully updated",
            news
        });

    } catch (err: any) {
        if (err.message === "Submit at least one fields to update the post")
            return res.status(400).send({ message: err.message });

        if (err.message === "No news found")
            return res.status(204).send();

        if (err.message === "You didn't update this post")
            return res.status(403).send({ message: err.message });

        if (err.message === "An unexpected error occurred")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const erase = async (req: Request, res: Response): Promise<Response | void> => {
    const newsId = res.locals.newsId;
    const userLoggedId = res.locals.userLoggedId;

    try {
        const newsDeleted = await newsService.eraseNewsService(newsId, userLoggedId);

        return res.status(200).send({
            message: "Post deleted successfully",
            news: newsDeleted
        });

    } catch (err: any) {
        if (err.message === "News not found")
            return res.status(204).send();

        if (err.message === "You didn't delete this post")
            return res.status(403).send({ message: err.message });

        if (err.message === "An unexpected error occurred")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const likeNews = async (req: Request, res: Response): Promise<Response | void> => {
    const newsId = res.locals.newsId;
    const userId = res.locals.userLoggedId;
    try {
        const isLiked = await newsService.likeNewsService(newsId, userId);

        res.status(200).send(isLiked);
    } catch (err: any) {
        if (err.message === "News not found")
            return res.status(204).send();

        if (err.message === "An unexpected error occurred")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const getPaginatedLikes = async (req: Request, res: Response): Promise<Response | void> => {
    let limit = req.query.limit ? Number(req.query.limit) : 10;
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    const currentUrl = req.baseUrl;
    const newsId = res.locals.newsId

    try {
        const { nextUrl, previousUrl, total, likes } = await newsService.getPaginatedLikesService(limit, offset, currentUrl, newsId);

        res.status(200).send({
            nextUrl,
            previousUrl,
            offset,
            total,
            likes
        });
    } catch (err: any) {
        if (err.message === "News not found")
            return res.status(204).send();

        if (err.message === "There are no registered likes")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const addComment = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const newsId = res.locals.newsId;
        const userId = res.locals.userLoggedId;
        const { content } = req.body;

        const commentResult = await newsService.addCommentService(newsId, userId, content);

        return res.status(201).send({ message: "Comment successfully completed", comment: commentResult });
    } catch (err: any) {
        if (err.message === "News not found")
            return res.status(204).send();

        if (err.message === "Write a message to comment")
            return res.status(400).send({ message: err.message });

        if (err.message === "Failed to create comment")
            return res.status(500).send({ message: "An unexpected error occurred" });

        return res.status(500).send({ message: "An unexpected error occurred" });
    }
};

const deleteComment = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const dataCommentId = res.locals.dataCommentId;
        const commentId = res.locals.commentId;
        const userId = res.locals.userLoggedId

        await newsService.deleteCommentService(dataCommentId, commentId, userId);
        res.status(200).send({
            message: "Comment successfully removed"
        });
    } catch (err: any) {
        if (err.message === "Comment not found")
            return res.status(204).send();

        if (err.message === "You can't delete this comment")
            return res.status(403).send({ message: err.message });

        if (err.message === "Failed to delete comment")
            return res.status(500).send({ message: "An unexpected error occurred" });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const getPaginatedComments = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const newsId = res.locals.newsId;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;
        const currentUrl = req.baseUrl;

        const { nextUrl, previousUrl, total, comments } = await newsService.getPaginatedCommentsService(newsId, limit, offset, currentUrl);

        res.status(200).send({
            nextUrl,
            previousUrl,
            offset,
            total,
            comments
        });
    } catch (err: any) {
        if (err.message === "News not found")
            return res.status(204).send();

        if (err.message === "There are no registered comments")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const likeComment = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const dataCommentId = res.locals.dataCommentId;
        const commentId = res.locals.commentId;
        const userId = res.locals.userLoggedId;

        const isLiked = await newsService.likeCommentService(dataCommentId, commentId, userId);

        res.status(200).send(isLiked);
    } catch (err: any) {
        if (err.message === "Comment not found")
            return res.status(204).send();

        if (err.message === "An unexpected error occurred")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const addReplyComment = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const dataCommentId = res.locals.dataCommentId;
        const commentId = res.locals.commentId;
        const userId = res.locals.userLoggedId;
        const { content } = req.body;

        const reply = await newsService.addReplyCommentService(dataCommentId, commentId, userId, content);
        res.status(200).send({
            message: "Reply successfully completed",
            reply
        });

    } catch (err: any) {
        if (err.message === "Comment not found")
            return res.status(204).send();

        if (err.message === "Write a message to reply")
            return res.status(400).send({ message: err.message });

        if (err.message === "Failed to create reply")
            return res.status(500).send({ message: "An unexpected error occurred" });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const deleteReply = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const dataReplyId = res.locals.dataReplyId;
        const replyId = res.locals.replyId;
        const userId = res.locals.userLoggedId;

        await newsService.deleteReplyService(dataReplyId, replyId, userId);

        res.status(200).send({ message: "Reply successfully removed" });
    } catch (err: any) {
        if (err.message === "Reply not found")
            return res.status(204).send();

        if (err.message === "You can't delete this reply")
            return res.status(403).send({ message: err.message });

        if (err.message === "Failed to delete reply")
            return res.status(500).send({ message: "An unexpected error occurred" });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const getPaginatedReply = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const dataCommentId = res.locals.dataCommentId;
        const commentId = res.locals.commentId;
        let limit = req.query.limit ? Number(req.query.limit) : 10;
        let offset = req.query.offset ? Number(req.query.offset) : 0;
        const currentUrl = req.baseUrl;

        const { nextUrl, previousUrl, total, replies } = await newsService.getPaginatedReplyService(dataCommentId, commentId, limit, offset, currentUrl)

        res.status(200).send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            replies
        });
    } catch (err: any) {
        if (err.message === "Comment not found")
            return res.status(204).send();

        if (err.message === "Failed to retrieve replies")
            return res.status(500).send({ message: err.message });

        if (err.message === "There are no registered replies")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const likeReply = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const dataReplyId = res.locals.dataReplyId;
        const replyId = res.locals.replyId;
        const userId = res.locals.userLoggedId;

        const isLike = await newsService.likeReplyService(dataReplyId, replyId, userId);

        return res.status(200).send(isLike);

    } catch (err: any) {
        if (err.message === "Reply not found")
            return res.status(204).send();

        if (err.message === "An unexpected error occurred")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default {
    create,
    findAll,
    topNews,
    findById,
    searchByTitle,
    newsByUser,
    upDate,
    erase,
    likeNews,
    addComment,
    deleteComment,
    addReplyComment,
    deleteReply,
    likeComment,
    getPaginatedComments,
    getPaginatedLikes,
    getPaginatedReply,
    likeReply
};