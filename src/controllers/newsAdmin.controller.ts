import { INews } from "../../custom";
import newsAdminService from "../services/newsAdmin.service";
import { Request, Response } from "express"

const createNews = async (req: Request, res: Response): Promise<Response | void> => {
    const body = req.body;

    try {
        const news: INews = await newsAdminService.createNewsService(body);

        res.status(201).send(news);
    } catch (err: any) {
        if (err.message === "Submit all fields to post")
            return res.status(400).send({ message: err.message });

        if (err.message === "Journalist not found")
            return res.status(404).send({ message: err.message });

        if (err.message === "Error creating News")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const upDateNews = async (req: Request, res: Response): Promise<Response | void> => {
    const newsId = res.locals.newsId
    const body = req.body;

    try {
        const news: INews = await newsAdminService.updateNewsService(newsId, body);

        return res.status(200).send({
            message: "Post successfully updated",
            news
        });

    } catch (err: any) {
        if (err.message === "Submit at least one fields to update the post")
            return res.status(400).send({ message: err.message });

        if (err.message === "News not found")
            return res.status(404).send({ message: err.message });


        if (err.message === "Failed to update news")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const eraseNews = async (req: Request, res: Response): Promise<Response | void> => {
    const newsId = res.locals.newsId;

    try {
        const newsDeleted = await newsAdminService.eraseNewsService(newsId);

        return res.status(200).send({
            message: "Post deleted successfully",
            news: newsDeleted
        });

    } catch (err: any) {
        if (err.message === "News not found")
            return res.status(404).send({ message: err.message });

        if (err.message === "Failed to delete news")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default {
    createNews,
    upDateNews,
    eraseNews
};