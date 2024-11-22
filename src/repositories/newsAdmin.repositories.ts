import { INews } from "../../custom";
import { NewsModel } from "../database/db";
// import { Types } from 'mongoose';

const createNewsRepositories = async (body: any): Promise<INews> => (await NewsModel.create(body)).populate("authorId");

// const findAllNewsRepositories = (offset: number, limit: number): Promise<INews[] | []> => NewsModel.find().sort({ _id: -1 }).skip(offset).limit(limit)
//     .populate("user");

// const countNewsRepositories = (): Promise<number> => NewsModel.countDocuments();

// const topNewsRepositories = (): Promise<INews | null> => NewsModel.findOne().sort({ _id: -1 }).populate("user");

// const findNewsByIdRepositories = async (newsId: Types.ObjectId): Promise<INews | null> => await NewsModel.findById(newsId).populate("user");

// const searchByTitleRepositories = (title: string): Promise<INews[] | []> => NewsModel.find({ title: { $regex: `${title || ""}`, $options: "i" } })
//     .sort({ _id: -1 }).populate("user");

// const newsByUserRepositories = (userId: string): Promise<INews[] | []> => NewsModel.find({ user: userId }).sort({ _id: -1 }).populate("user");

// const upDateRepositories = (newsId: Types.ObjectId, title: string, text: string, banner: string): Promise<INews | null> =>
//     NewsModel.findOneAndUpdate({ _id: newsId }, { title, text, banner }, { new: true, });

// const eraseNewsRepositories = (newsId: Types.ObjectId): Promise<INews | null> => NewsModel.findOneAndDelete({ _id: newsId });


export default {
    createNewsRepositories,
    // findAllNewsRepositories,
    // countNewsRepositories,
    // topNewsRepositories,
    // findNewsByIdRepositories,
    // searchByTitleRepositories,
    // newsByUserRepositories,
    // upDateRepositories,
    // eraseNewsRepositories
};