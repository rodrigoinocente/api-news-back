import { INews } from "../../custom";
import { NewsModel } from "../database/db";
import { Types } from 'mongoose';

const createNewsRepositories = async (body: any): Promise<INews> => (await NewsModel.create(body)).populate("authorId");

const findNewsByIdRepositories = async (newsId: Types.ObjectId): Promise<INews | null> => await NewsModel.findById(newsId).populate("authorId");

const upDateNewsRepositories = (newsId: Types.ObjectId, body: INews): Promise<INews | null> =>
    NewsModel.findOneAndUpdate({ _id: newsId }, { ...body }, { new: true, });

// const eraseNewsRepositories = (newsId: Types.ObjectId): Promise<INews | null> => NewsModel.findOneAndDelete({ _id: newsId });


export default {
    createNewsRepositories,
    findNewsByIdRepositories,
    upDateNewsRepositories,
    // eraseNewsRepositories
};