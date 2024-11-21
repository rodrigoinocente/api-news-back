import { Types } from "mongoose";
import {  INews, Paginated} from "../../custom";
import newsRepositories from "../repositories/newsUser.repositories";

const createNewsService = async (body: any, user: Types.ObjectId): Promise<INews> => {
    const { title, text, banner } = body;
    if (!title || !text || !banner) throw new Error("Submit all fields to post");

    const newsData = { ...body, user };
    const news: INews = await newsRepositories.createNewsRepositories(newsData);

    return news
};

const findAllNewsService = async (offset: number, limit: number, currentUrl: string): Promise<Paginated> => {

    const news: INews[] = await newsRepositories.findAllNewsRepositories(offset, limit);
    const total: number = await newsRepositories.countNewsRepositories();

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

    if (news.length === 0)
        throw new Error("No news found");

    return ({
        nextUrl,
        previousUrl,
        offset,
        total,
        news
    });
};

const topNewsService = async (): Promise<INews> => {
    const news: INews | null = await newsRepositories.topNewsRepositories();
    if (!news)
        throw new Error("No news found")

    return news;
};

const findByIdService = async (newsId: Types.ObjectId): Promise<INews> => {
    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
    if (!news)
        throw new Error("No news found")

    return news;
};

const searchByTitleService = async (title: string): Promise<INews[]> => {
    const news: INews[] | [] = await newsRepositories.searchByTitleRepositories(title);
    if (news.length === 0)
        throw new Error("No news found");

    return news;
};

const newsByUserService = async (userId: string): Promise<INews[]> => {
    const news: INews[] | [] = await newsRepositories.newsByUserRepositories(userId);
    if (news.length === 0)
        throw new Error("No news found");

    return news;
};

// const updateNewsService = async (newsId: Types.ObjectId, body: ICreateAndUpdateNewsBody, userLoggedId: Types.ObjectId): Promise<INews> => {
//     const { title, text, banner } = body;


//     if (!title && !text && !banner)
//         throw new Error("Submit at least one fields to update the post");

//     const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
//     if (!news)
//         throw new Error("News not found");

//     if (String(news.user._id) !== String(userLoggedId))
//         throw new Error("You didn't update this post");

//     const newsUpdate: INews | null = await newsRepositories.upDateRepositories(newsId, title, text, banner);
//     if (!newsUpdate)
//         throw new Error("An unexpected error occurred");

//     return newsUpdate;

// };

// const eraseNewsService = async (newsId: Types.ObjectId, userLoggedId: Types.ObjectId): Promise<INews> => {
//     const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId)
//     if (!news)
//         throw new Error("News not found");

//     if (String(news.user._id) !== String(userLoggedId))
//         throw new Error("You didn't delete this post");

//     const newsDeleted = await newsRepositories.eraseNewsRepositories(news._id);
//     if (!newsDeleted)
//         throw new Error("An unexpected error occurred");

//     return newsDeleted;
// };

export default {
    createNewsService,
    findAllNewsService,
    topNewsService,
    findByIdService,
    searchByTitleService,
    newsByUserService,
    // updateNewsService,
    // eraseNewsService
};