import { IColumn, IJournalist, INews } from "../../custom";
import { JournalistModel, NewsModel } from "../database/db";
import { Types } from 'mongoose';


const getHomePageDataServiceRepositories = () => NewsModel.aggregate(
    [{
        $facet: {
            newsFull: [
                { $project: { title: 1, subtitle: 1, banner: 1, publishedAt: 1 } },
                { $sort: { publishedAt: -1 } },
                { $skip: 0 },
                { $limit: 5 }
            ],
            newsMini: [
                { $project: { title: 1, banner: 1, publishedAt: 1 } },
                { $sort: { publishedAt: -1 } },
                { $skip: 5 },
                { $limit: 5 }
            ]
        }
    },
    {
        $unionWith: {
            coll: "column",
            pipeline: [
                {
                    $facet: {
                        column: [
                            { $project: { title: 1 } },
                            { $sort: { _id: -1 } },
                            { $skip: 0 },
                            { $limit: 5 }
                        ]
                    }
                }
            ]
        }
    }]
);


const findAllNewsRepositories = (offset: number, limit: number): Promise<INews[] | []> => NewsModel.find()
    .sort({ _id: -1 })
    .skip(offset).limit(limit)
    .select("_id title subtitle banner content publishedAt edited");

const countNewsRepositories = (): Promise<number> => NewsModel.countDocuments();

const findNewsByCategoryRepositories = (category: string, offset: number, limit: number): Promise<INews[] | []> =>
    NewsModel.find({ category: category }).select("_id title subtitle banner content publishedAt").sort({ _id: -1 }).skip(offset).limit(limit)

const countNewsByCategoryRepositories = (category: string): Promise<number> => NewsModel.countDocuments({ category: category });

const topNewsRepositories = (): Promise<INews | null> => NewsModel.findOne().sort({ _id: -1 }).populate("user");

const findNewsByIdRepositories = (newsId: Types.ObjectId): Promise<INews | null> => NewsModel.findById(newsId).populate("authorId");

const searchNewsByTitleRepositories = (title: string): Promise<INews[] | []> =>
    NewsModel.find({ title: { $regex: `${title || ""}`, $options: "i" } })
        .select("_id title subtitle banner content publishedAt")
        .sort({ _id: -1 });

const newsByJournalistRepositories = (jounalistId: Types.ObjectId, offset: number, limit: number): Promise<INews[] | []> =>
    NewsModel.find({ authorId: jounalistId })
        .sort({ _id: -1 })
        .select("_id title subtitle banner content publishedAt")
        .skip(offset).limit(limit);

const countNewsByJournalistRepositories = (jounalistId: Types.ObjectId): Promise<number> => NewsModel.countDocuments({ authorId: jounalistId });

const findJournalistRepositories = (jounalistId: Types.ObjectId): Promise<IJournalist | null> =>
    JournalistModel.findById(jounalistId)
        .select("   name bio profilePicture");




export default {
    getHomePageDataServiceRepositories,
    findAllNewsRepositories,
    countNewsRepositories,
    findNewsByCategoryRepositories,
    countNewsByCategoryRepositories,
    topNewsRepositories,
    findNewsByIdRepositories,
    searchNewsByTitleRepositories,
    newsByJournalistRepositories,
    countNewsByJournalistRepositories,
    findJournalistRepositories
};