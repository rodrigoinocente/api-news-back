import { INews } from "../../custom";
import { NewsModel } from "../database/db";
import { Types } from 'mongoose';

const findAllNewsRepositories = (offset: number, limit: number): Promise<INews[] | []> => NewsModel.find().sort({ _id: -1 }).skip(offset).limit(limit);

const countNewsRepositories = (): Promise<number> => NewsModel.countDocuments();

const findNewsByCategoryRepositories = (category: string, offset: number, limit: number): Promise<INews[] | []> =>
    NewsModel.find({ category: category }).select("_id title subtitle banner content category publishedAt").sort({ _id: -1 }).skip(offset).limit(limit)

const countNewsByCategoryRepositories = (category: string): Promise<number> => NewsModel.countDocuments({ category: category });

const topNewsRepositories = (): Promise<INews | null> => NewsModel.findOne().sort({ _id: -1 }).populate("user");

const findNewsByIdRepositories = (newsId: Types.ObjectId): Promise<INews | null> => NewsModel.findById(newsId).populate("authorId");

const searchNewsByTitleRepositories = (title: string): Promise<INews[] | []> => 
NewsModel.find({ title: { $regex: `${title || ""}`, $options: "i" } })
.select("_id title subtitle banner content category publishedAt")
.sort({ _id: -1 });

const newsByUserRepositories = (userId: string): Promise<INews[] | []> => NewsModel.find({ user: userId }).sort({ _id: -1 }).populate("user");

const upDateRepositories = (newsId: Types.ObjectId, title: string, text: string, banner: string): Promise<INews | null> =>
    NewsModel.findOneAndUpdate({ _id: newsId }, { title, text, banner }, { new: true, });

const eraseNewsRepositories = (newsId: Types.ObjectId): Promise<INews | null> => NewsModel.findOneAndDelete({ _id: newsId });


export default {
    findAllNewsRepositories,
    countNewsRepositories,
    findNewsByCategoryRepositories,
    countNewsByCategoryRepositories,
    topNewsRepositories,
    findNewsByIdRepositories,
    searchNewsByTitleRepositories,
    newsByUserRepositories,
    upDateRepositories,
    eraseNewsRepositories
};