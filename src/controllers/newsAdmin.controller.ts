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

const findNewsById = async (req: Request, res: Response): Promise<Response | void> => {
    const newsId = res.locals.newsId;

    try {
        const news: INews | null = await newsAdminService.findNewsByIdService(newsId);
        return res.status(200).send(news);
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(404).send({ message: err.message });

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

// const erase = async (req: Request, res: Response): Promise<Response | void> => {
//     const newsId = res.locals.newsId;
//     const userLoggedId = res.locals.userLoggedId;

//     try {
//         const newsDeleted = await newsService.eraseNewsService(newsId, userLoggedId);

//         return res.status(200).send({
//             message: "Post deleted successfully",
//             news: newsDeleted
//         });

//     } catch (err: any) {
//         if (err.message === "News not found")
//             return res.status(204).send();

//         if (err.message === "You didn't delete this post")
//             return res.status(403).send({ message: err.message });

//         if (err.message === "An unexpected error occurred")
//             return res.status(500).send({ message: err.message });

//         return res.status(500).send({ message: "An unexpected error occurred" });
//     };
// };

export default {
    createNews,
    findNewsById,
    upDateNews,
    //     erase
};