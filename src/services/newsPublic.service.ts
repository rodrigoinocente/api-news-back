import { Types } from "mongoose";
import { IJournalist, INews, Paginated } from "../../custom";
import newsRepositories from "../repositories/newsPublic.repositories";

const getHomePageDataService = async () => {
    const response = await newsRepositories.getHomePageDataServiceRepositories();
    if(!response) throw new Error("Home data not loaded")
        
    return response
}

const findAllNewsService = async (offset: number, limit: number, fullUrl: string): Promise<Paginated> => {
    const news: INews[] = await newsRepositories.findAllNewsRepositories(offset, limit);
    const total: number = await newsRepositories.countNewsRepositories();

    const next = offset + limit;
    const nextUrl = next < total ? `${fullUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${fullUrl}?limit=${limit}&offset=${previous}` : null;

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

const findNewsByCategoryService = async (category: string, offset: number, limit: number): Promise<Paginated> => {
    const news: INews[] = await newsRepositories.findNewsByCategoryRepositories(category, offset, limit);
    const total: number = await newsRepositories.countNewsByCategoryRepositories(category);

    const next = offset + limit;
    const hasMore = next < total ? true : false;
    const nextOffset = next

    if (news.length === 0)
        throw new Error("No news found");

    return ({
        hasMore,
        nextOffset,
        news
    });
};

const topNewsService = async (): Promise<INews> => {
    const news: INews | null = await newsRepositories.topNewsRepositories();
    if (!news)
        throw new Error("No news found")

    return news;
};

const findNewsByIdService = async (newsId: Types.ObjectId): Promise<INews> => {
    const news: INews | null = await newsRepositories.findNewsByIdRepositories(newsId);
    if (!news)
        throw new Error("No news found")

    return news;
};

const searchNewsByTitleService = async (title: string): Promise<INews[]> => {
    const news: INews[] | [] = await newsRepositories.searchNewsByTitleRepositories(title);
    if (news.length === 0)
        throw new Error("No news found");

    return news;
};

const findNewsByJournalistService = async (jounalistId: Types.ObjectId, offset: number, limit: number): Promise<Paginated> => {
    const news: INews[] = await newsRepositories.newsByJournalistRepositories(jounalistId, offset, limit);
    const total: number = await newsRepositories.countNewsByJournalistRepositories(jounalistId);
    
    const next = offset + limit;
    const hasMore = next < total ? true : false;
    const nextOffset = next

    if (news.length === 0)
        throw new Error("No news found");

    return ({
        hasMore,
        nextOffset,
        news
    });
};

const findJournalistService= async (jounalistId: Types.ObjectId): Promise<IJournalist> => {
    const jounalist: IJournalist | null = await newsRepositories.findJournalistRepositories(jounalistId);
    if(!jounalist) throw new Error("No journalist found")

    return jounalist;
};

export default {
    getHomePageDataService,
    findAllNewsService,
    findNewsByCategoryService,
    topNewsService,
    findNewsByIdService,
    searchNewsByTitleService,
    findNewsByJournalistService,
    findJournalistService
};