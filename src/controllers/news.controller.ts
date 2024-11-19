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

export default {
    create,
    findAll,
    topNews,
    findById,
    searchByTitle,
    newsByUser,
    upDate,
    erase
};