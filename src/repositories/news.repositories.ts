import { ICommentNews, ICreateAndUpdateNewsBody, ILikeComment, ILikeNews, ILikeReply, INews, IReplyComment } from "../../custom";
import { NewsModel, LikeNewsModel, CommentModel, LikeCommentModel, ReplyCommentModel, LikeReplyModel } from "../database/db";
import { Types, UpdateWriteOpResult } from 'mongoose';

const createNewsRepositories = async (body: ICreateAndUpdateNewsBody): Promise<INews> => (await NewsModel.create(body)).populate("user");

const findAllNewsRepositories = (offset: number, limit: number): Promise<INews[] | []> => NewsModel.find().sort({ _id: -1 }).skip(offset).limit(limit)
    .populate("user");

const countNewsRepositories = (): Promise<number> => NewsModel.countDocuments();

const topNewsRepositories = (): Promise<INews | null> => NewsModel.findOne().sort({ _id: -1 }).populate("user");

const findNewsByIdRepositories = async (newsId: Types.ObjectId): Promise<INews | null> => await NewsModel.findById(newsId).populate("user");

const searchByTitleRepositories = (title: string): Promise<INews[] | []> => NewsModel.find({ title: { $regex: `${title || ""}`, $options: "i" } })
    .sort({ _id: -1 }).populate("user");

const newsByUserRepositories = (userId: string): Promise<INews[] | []> => NewsModel.find({ user: userId }).sort({ _id: -1 }).populate("user");

const upDateRepositories = (newsId: Types.ObjectId, title: string, text: string, banner: string): Promise<INews | null> =>
    NewsModel.findOneAndUpdate({ _id: newsId }, { title, text, banner }, { new: true, });

const eraseNewsRepositories = (newsId: Types.ObjectId): Promise<INews | null> => NewsModel.findOneAndDelete({ _id: newsId });

const createNewsDataLikeRepositories = (newsId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews> =>
    LikeNewsModel.create({ newsId, likes: { userId } });

const updateNewsDataLikeId = (newsId: Types.ObjectId, newDataLike: Types.ObjectId): Promise<INews | null> =>
    NewsModel.findOneAndUpdate({ _id: newsId }, { $set: { dataLikeId: newDataLike } });

const isUserInLikeNewsArray = (dataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<object | null> =>
    LikeNewsModel.exists({ _id: dataLikeId, "likes.userId": [userId] });

const likeNewsRepositories = (dataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews | null> =>
    LikeNewsModel.findOneAndUpdate({ _id: dataLikeId }, { $push: { likes: { userId } } });

const deleteLikeNewsRepositories = (dataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews | null> =>
    LikeNewsModel.findOneAndUpdate({ _id: dataLikeId }, { $pull: { likes: { userId } } });

const likesPipelineRepositories = (dataLikeId: Types.ObjectId, offset: number, limit: number): Promise<ILikeNews[] | []> => {
    return LikeNewsModel.aggregate([
        { $match: { _id: dataLikeId } },
        { $unwind: { path: "$likes" } },
        { $sort: { "likes.createdAt": -1 } },
        { $skip: offset },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "likes.userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: { path: "$user" } },
        {
            $project: {
                "user.name": 1,
                "user.username": 1,
                "user.email": 1,
                _id: 0,
            },
        },
    ]
    );
};

const createCommentDataRepositories = (newsId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews> =>
    CommentModel.create({ newsId, comment: [{ userId, content }] });

const updateNewsDataCommentId = (newsId: Types.ObjectId, dataCommentId: Types.ObjectId): Promise<INews | null> =>
    NewsModel.findOneAndUpdate({ _id: newsId }, { $set: { dataCommentId: dataCommentId } });

const upDateCommentDataRepositories = (dataCommentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews | null> =>
    CommentModel.findOneAndUpdate({ _id: dataCommentId }, { $push: { comment: [{ userId, content }] } }, { new: true });

const deleteCommentRepositories = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId): Promise<UpdateWriteOpResult | null> =>
    CommentModel.updateMany({ _id: dataCommentId }, { $pull: { comment: { _id: commentId } } });

const findCommentByIdRepositories = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId): Promise<ICommentNews | null> =>
    CommentModel.findOne({ _id: dataCommentId, "comment._id": commentId }, { "comment.$": 1 });

const commentsPipelineRepositories = (dataCommentId: Types.ObjectId, offset: number, limit: number): Promise<ICommentNews[] | []> => {
    return CommentModel.aggregate([
        { $match: { _id: dataCommentId } },
        { $unwind: { path: "$comment" } },
        { $sort: { "comment.createdAt": -1 } },
        { $skip: offset },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "comment.userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: { path: "$user" } },
        {
            $project: {
                "user.name": 1,
                "user.username": 1,
                "user.email": 1,
                "comment.content": 1,
                "comment.dataLikeId": 1,
                "comment.dataReplyId": 1,
                "comment.likeCount": 1,
                "comment.replyCount": 1,
                "comment.createdAt": 1,
                "comment._id": 1,
                "_id": 1,
            },
        },
    ]
    );
};

const createLikeCommentDataRepositories = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeComment | null> =>
    LikeCommentModel.create({ dataCommentId, commentId, likes: { userId } });

const updateCommentDataLikeId = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, dataLikeCommentId: Types.ObjectId): Promise<ICommentNews | null> =>
    CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataLikeId": dataLikeCommentId } });

const isUserInLikeCommentArray = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<object | null> =>
    LikeCommentModel.exists({ _id: dataLikeCommentId, "likes.userId": [userId] });

const likeCommentRepositories = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews | null> => LikeCommentModel.findOneAndUpdate(
    { _id: dataLikeCommentId }, { $push: { likes: { userId } } });

const deleteLikeCommentRepositories = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews | null> =>
    LikeCommentModel.findOneAndUpdate({ _id: dataLikeCommentId }, { $pull: { likes: { userId } } });

const createReplyCommentDataRepositories = (
    dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment | null> =>
    ReplyCommentModel.create({ dataCommentId, commentId, reply: { userId, content } });

const updateCommentDataReplyRepositories = (
    dataCommentId: Types.ObjectId, commentId: Types.ObjectId, newDataReplyId: Types.ObjectId): Promise<ICommentNews | null> =>
    CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataReplyId": newDataReplyId } });

const addReplyCommentDataRepositories = (
    commentDataReplyId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment | null> =>
    ReplyCommentModel.findOneAndUpdate({ _id: commentDataReplyId }, { $push: { reply: [{ userId, content }] } }, { new: true });

const findReplyByIdRepositories = (dataReplyId: Types.ObjectId, replyId: Types.ObjectId): Promise<IReplyComment | null> =>
    ReplyCommentModel.findOne({ _id: dataReplyId, "reply._id": replyId }, { "reply.$": 1 })

const deleteReplyCommentRepositories = (dataReplyId: Types.ObjectId, replyId: Types.ObjectId): Promise<UpdateWriteOpResult | void> =>
    ReplyCommentModel.updateMany({ _id: dataReplyId }, { $pull: { reply: { _id: replyId } } });

const replyCommentsPipelineRepositories = (dataReplyCommentId: Types.ObjectId, offset: number, limit: number): Promise<IReplyComment[] | []> => {
    return ReplyCommentModel.aggregate([
        { $match: { _id: dataReplyCommentId } },
        { $unwind: { path: "$reply" } },
        { $sort: { "reply.createdAt": -1 } },
        { $skip: offset },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "reply.userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: { path: "$user" } },
        {
            $project: {
                "user.name": 1,
                "user.username": 1,
                "user.email": 1,
                "reply.content": 1,
                "reply.dataLikeId": 1,
                "reply.likeCount": 1,
                "reply.createdAt": 1,
                "reply._id": 1,
                "_id": 1,
            },
        },
    ]
    );
};

const createLikeReplyDataRepositories = async (
    dataReplyCommentId: Types.ObjectId, replyCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeReply | null> =>
    LikeReplyModel.create({ dataReplyCommentId, replyCommentId, likes: { userId } });

const updateReplyDataLikeRepositories = (dataReplyCommentId: Types.ObjectId, replyCommentId: Types.ObjectId, dataLikeId: Types.ObjectId) =>
    ReplyCommentModel.findOneAndUpdate({ _id: dataReplyCommentId, "reply._id": replyCommentId }, { $set: { "reply.$.dataLikeId": dataLikeId } });

const isUserInLikeReplyArray = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<object | null> =>
    LikeReplyModel.exists({ _id: replyDataLikeId, "likes.userId": [userId] });

const likeReplyRepositories = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeReply | null> =>
    LikeReplyModel.findOneAndUpdate({ _id: replyDataLikeId }, { $push: { likes: { userId } } });

const deleteLikeReplyRepositories = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeReply | null> =>
    LikeReplyModel.findOneAndUpdate({ _id: replyDataLikeId }, { $pull: { likes: { userId } } });

export default {
    createNewsRepositories,
    findAllNewsRepositories,
    countNewsRepositories,
    topNewsRepositories,
    findNewsByIdRepositories,
    searchByTitleRepositories,
    newsByUserRepositories,
    upDateRepositories,
    eraseNewsRepositories,
    likeNewsRepositories,
    deleteLikeCommentRepositories,
    deleteLikeNewsRepositories,
    deleteCommentRepositories,
    createReplyCommentDataRepositories,
    updateCommentDataReplyRepositories,
    addReplyCommentDataRepositories,
    deleteReplyCommentRepositories,
    createNewsDataLikeRepositories,
    updateNewsDataLikeId,
    createCommentDataRepositories,
    updateNewsDataCommentId,
    upDateCommentDataRepositories,
    findCommentByIdRepositories,
    createLikeCommentDataRepositories,
    updateCommentDataLikeId,
    likeCommentRepositories,
    commentsPipelineRepositories,
    isUserInLikeNewsArray,
    likesPipelineRepositories,
    isUserInLikeCommentArray,
    findReplyByIdRepositories,
    replyCommentsPipelineRepositories,
    createLikeReplyDataRepositories,
    updateReplyDataLikeRepositories,
    isUserInLikeReplyArray,
    likeReplyRepositories,
    deleteLikeReplyRepositories
};