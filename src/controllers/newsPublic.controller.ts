import { INews } from "../../custom";
import newsService from "../services/newsPublic.service";
import { Request, Response } from "express"

const getHomePageData = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const response = await newsService.getHomePageDataService();

        res.status(200).send(response);
    } catch (err: any) {
        if (err.message === "Home data not loaded")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    }
};

const findAllNews = async (req: Request, res: Response): Promise<Response | void> => {
    let limit = req.query.limit ? Number(req.query.limit) : 15;
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    const fullUrl = `${req.baseUrl}${req.path}`;

    try {
        const { nextUrl, previousUrl, total, news } = await newsService.findAllNewsService(offset, limit, fullUrl);

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

const findNewsByCategory = async (req: Request, res: Response): Promise<Response | void> => {
    let limit = req.query.limit ? Number(req.query.limit) : 15;
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    const { category } = req.params

    try {
        const { news, nextOffset, hasMore } = await newsService.findNewsByCategoryService(category, offset, limit);

        res.status(200).send({
            hasMore,
            nextOffset,
            news
        });
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

// const topNews = async (req: Request, res: Response): Promise<Response | void> => {
//     try {
//         const news: INews | null = await newsService.topNewsService();

//         return res.status(200).send(news);
//     } catch (err: any) {
//         if (err.message === "No news found")
//             return res.status(204).send();

//         return res.status(500).send({ message: "An unexpected error occurred" });
//     };
// };

const findNewsById = async (req: Request, res: Response): Promise<Response | void> => {
    const newsId = res.locals.newsId;

    try {
        const news: INews | null = await newsService.findNewsByIdService(newsId);
        return res.status(200).send(news);
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const searchNewsByTitle = async (req: Request, res: Response): Promise<Response | void> => {
    const { title } = req.query;

    try {
        const news: INews[] | null = await newsService.searchNewsByTitleService(title as string);

        return res.status(200).send(news);
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(204).send();

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const newsByJournalist = async (req: Request, res: Response): Promise<Response | void> => {
    let limit = req.query.limit ? Number(req.query.limit) : 15;
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    const journalistId = res.locals.journalistId;

    try {
        const { news, nextOffset, hasMore } = await newsService.findNewsByJournalistService(journalistId, offset, limit);

        res.status(200).send({
            hasMore,
            nextOffset,
            news
        });
    } catch (err: any) {
        if (err.message === "No news found")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};


const findJournalist = async (req: Request, res: Response): Promise<Response | void> => {
    const journalistId = res.locals.journalistId;

    try {
        const journalist = await newsService.findJournalistService(journalistId);

        res.status(200).send(journalist);
    } catch (err: any) {
        if (err.message === "No journalist found")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};


export default {
    getHomePageData,
    findAllNews,
    findNewsByCategory,
    //     topNews,
    findNewsById,
    searchNewsByTitle,
    newsByJournalist,
    findJournalist
};