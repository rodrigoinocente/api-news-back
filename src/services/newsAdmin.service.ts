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

    const news: INews = await newsAdminRepositories.createNewsRepositories({
        ...body,
        publishedAt: new Date()
    })
    if (!news) throw new Error("Error creating News")

    return news
};

const updateNewsService = async (newsId: Types.ObjectId, body: INews): Promise<INews> => {
    const { title, content, subtitle, banner, authorId, category, tags } = body;

    if (!title && !content && !subtitle && !banner && !authorId && !category && !tags)
        throw new Error("Submit at least one fields to update the post");

    const news: INews | null = await newsAdminRepositories.findNewsByIdRepositories(newsId);
    if (!news) throw new Error("News not found");

    body = {...body, edited: new Date()}

    const newsUpdate: INews | null = await newsAdminRepositories.upDateNewsRepositories(newsId, body);
    if (!newsUpdate) throw new Error("Failed to update news");

    return newsUpdate;
};

const eraseNewsService = async (newsId: Types.ObjectId): Promise<INews> => {
    const news: INews | null = await newsAdminRepositories.findNewsByIdRepositories(newsId)
    if (!news)
        throw new Error("News not found");

    const newsDeleted = await newsAdminRepositories.eraseNewsRepositories(news._id);
    if (!newsDeleted)
        throw new Error("Failed to delete news");

    return newsDeleted;
};

export default {
    createNewsService,
    updateNewsService,
    eraseNewsService
};