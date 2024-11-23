import { Types } from "mongoose";
import { INews, Paginated } from "../../custom";
import newsAdminRepositories from "../repositories/newsAdmin.repositories";
import journalistRepositories from "../repositories/journalist.repositories";

const createNewsService = async (body: INews): Promise<INews> => {
    const { title, content, subtitle, banner, authorId, category, tags } = body;
    if (!title || !content || !subtitle || !banner || !authorId || !category || !tags)
        throw new Error("Submit all fields to post");

    const journalist = await journalistRepositories.findJournalistByIdRepositories(authorId)
    if (!journalist) throw new Error("Journalist not found")

    const news: INews = await newsAdminRepositories.createNewsRepositories(body);
    if (!news) throw new Error("Error creating News")

    return news
};

const findNewsByIdService = async (newsId: Types.ObjectId): Promise<INews> => {
    const news: INews | null = await newsAdminRepositories.findNewsByIdRepositories(newsId);
    if (!news)
        throw new Error("No news found")

    return news;
};

// const searchByTitleService = async (title: string): Promise<INews[]> => {
//     const news: INews[] | [] = await newsRepositories.searchByTitleRepositories(title);
//     if (news.length === 0)
//         throw new Error("No news found");

//     return news;
// };

// const newsByUserService = async (userId: string): Promise<INews[]> => {
//     const news: INews[] | [] = await newsRepositories.newsByUserRepositories(userId);
//     if (news.length === 0)
//         throw new Error("No news found");

//     return news;
// };

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
    findNewsByIdService,
    // searchByTitleService,
    // newsByUserService,
    // updateNewsService,
    // eraseNewsService
};