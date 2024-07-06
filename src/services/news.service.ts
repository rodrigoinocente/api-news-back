import { ICommentNews, ILikeNews, ILikeReply, INews, IReplyComment } from "../../custom";
import { NewsModel, LikeNewsModel, CommentModel, LikeCommentModel, ReplyCommentModel, LikeReplyModel } from "../database/db";
import { Types } from 'mongoose';

const createNewsService = (body: any): Promise<INews> => NewsModel.create(body);

const findAllNewsService = (offset: number, limit: number): Promise<INews[] | []> => NewsModel.find().sort({ _id: -1 }).skip(offset).limit(limit)
    .populate("user");

const countNewsService = (): Promise<number> => NewsModel.countDocuments();

const topNewsService = (): Promise<INews | null> => NewsModel.findOne().sort({ _id: -1 }).populate("user");

const findNewsByIdService = (newsId: string): Promise<INews | null> => NewsModel.findById(newsId).populate("user");

const searchByTitleService = (title: string): Promise<INews[] | []> => NewsModel.find({ title: { $regex: `${title || ""}`, $options: "i" } })
    .sort({ _id: -1 }).populate("user") as any;

const newsByUserService = (userId: string): Promise<INews> => NewsModel.find({ user: userId }).sort({ _id: -1 }).populate("user") as any;

const upDateService = (newsId: Types.ObjectId, title: string, text: string, banner: string): Promise<INews | null> =>
    NewsModel.findOneAndUpdate({ _id: newsId }, { title, text, banner }, { rawResult: true, });

const eraseNewsService = (newsId: Types.ObjectId): Promise<INews | null> => NewsModel.findOneAndDelete({ _id: newsId });

const createNewsDataLikeService = async (newsId: Types.ObjectId, userId: Types.ObjectId): Promise<INews | void> => {
    const newDataLike = await LikeNewsModel.create({ newsId, likes: { userId } });
    await NewsModel.findOneAndUpdate({ _id: newsId }, { $set: { dataLike: newDataLike } });
};

const isUserInLikeNewsArray = (likesId: Types.ObjectId, userId: Types.ObjectId): Promise<object | null> =>
    LikeNewsModel.exists({ _id: likesId, "likes.userId": [userId] });

const likeNewsService = (likesId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews | null> =>
    LikeNewsModel.findOneAndUpdate({ _id: likesId }, { $push: { likes: { userId } } });

const deleteLikeNewsService = (likesId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews | null> =>
    LikeNewsModel.findOneAndUpdate({ _id: likesId }, { $pull: { likes: { userId } } });

const likesPipelineService = (dataLikeId: Types.ObjectId, offset: number, limit: number): Promise<ILikeNews[] | []> => {
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

const createCommentDataService = async (newsId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<INews | void> => {
    const newCommentDataList = await CommentModel.create({ newsId, comment: [{ userId, content }] });
    await NewsModel.findOneAndUpdate({ _id: newsId }, { $set: { dataComment: newCommentDataList._id } });
};

const upDateCommentDataService = async (dataCommentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews | void> => {
    await CommentModel.findOneAndUpdate({ _id: dataCommentId }, { $push: { comment: [{ userId, content }] } });
};

const deleteCommentService = async (dataCommentId: Types.ObjectId, commentId: Types.ObjectId): Promise<ICommentNews | void> => {
    await CommentModel.updateMany({ _id: dataCommentId }, { $pull: { comment: { _id: commentId } } });
};

const findCommentById = (dataCommentId: string, commentId: string): Promise<ICommentNews | null> => CommentModel.findOne(
    { _id: dataCommentId, "comment._id": commentId }, { "comment.$": 1 });

const commentsPipelineService = (dataCommentId: Types.ObjectId, offset: number, limit: number): Promise<ICommentNews[] | []> => {
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
                "comment.dataLike": 1,
                "comment.dataReply": 1,
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

const createLikeCommentDataService = async (
    dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId): Promise<ICommentNews | void> => {
    const newDataLike = await LikeCommentModel.create({ dataCommentId, commentId, likes: { userId } });
    await CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataLike": newDataLike._id } });
};

const isUserInLikeCommentArray = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<object | null> =>
    LikeCommentModel.exists({ _id: dataLikeCommentId, "likes.userId": [userId] });

const likeCommentService = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews | null> => LikeCommentModel.findOneAndUpdate(
    { _id: dataLikeCommentId }, { $push: { likes: { userId } } });

const deleteLikeCommentService = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeNews | null> =>
    LikeCommentModel.findOneAndUpdate({ _id: dataLikeCommentId }, { $pull: { likes: { userId } } });

const createReplyCommentDataService = async (
    dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews | void> => {
    const newDataReply = await ReplyCommentModel.create({ dataCommentId, commentId, reply: { userId, content } });
    await CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataReply": newDataReply._id } });
};

const upDateReplyCommentDataService = async (
    commentDataReplyId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment | void> => {
    await ReplyCommentModel.findOneAndUpdate({ _id: commentDataReplyId }, { $push: { reply: [{ userId, content }] } });
};

const findReplyById = (dataReplyId: string, replyId: string): Promise<IReplyComment | null> =>
    ReplyCommentModel.findOne({ _id: dataReplyId, "reply._id": replyId }, { "reply.$": 1 })

const deleteReplyCommentService = async (dataReplyId: Types.ObjectId, replyId: Types.ObjectId): Promise<IReplyComment | void> => {
    await ReplyCommentModel.updateMany({ _id: dataReplyId }, { $pull: { reply: { _id: replyId } } });
};

const replyCommentsPipelineService = (dataReplyCommentId: Types.ObjectId, offset: number, limit: number): Promise<IReplyComment[] | []> => {
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
                "reply.dataLike": 1,
                "reply.likeCount": 1,
                "reply.createdAt": 1,
                "reply._id": 1,
                "_id": 1,
            },
        },
    ]
    );
};

const createLikeReplyDataService = async (
    dataReplyCommentId: Types.ObjectId, replyCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<IReplyComment | void> => {
    const newDataLike = await LikeReplyModel.create({ dataReplyCommentId, replyCommentId, likes: { userId } });
    await ReplyCommentModel.findOneAndUpdate({ _id: dataReplyCommentId, "reply._id": replyCommentId }, { $set: { "reply.$.dataLike": newDataLike._id } });
};

const isUserInLikeReplyArray = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<object | null> =>
    LikeReplyModel.exists({ _id: replyDataLikeId, "likes.userId": [userId] });

const likeReplyService = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeReply | null> =>
    LikeReplyModel.findOneAndUpdate({ _id: replyDataLikeId }, { $push: { likes: { userId } } });

const deleteLikeReplyService = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeReply | null> =>
    LikeReplyModel.findOneAndUpdate({ _id: replyDataLikeId }, { $pull: { likes: { userId } } });

export default {
    createNewsService,
    findAllNewsService,
    countNewsService,
    topNewsService,
    findNewsByIdService,
    searchByTitleService,
    newsByUserService,
    upDateService,
    eraseNewsService,
    likeNewsService,
    deleteLikeCommentService,
    deleteLikeNewsService,
    deleteCommentService,
    createReplyCommentDataService,
    upDateReplyCommentDataService,
    deleteReplyCommentService,
    createNewsDataLikeService,
    createCommentDataService,
    upDateCommentDataService,
    findCommentById,
    createLikeCommentDataService,
    likeCommentService,
    commentsPipelineService,
    isUserInLikeNewsArray,
    likesPipelineService,
    isUserInLikeCommentArray,
    findReplyById,
    replyCommentsPipelineService,
    createLikeReplyDataService,
    isUserInLikeReplyArray,
    likeReplyService,
    deleteLikeReplyService
};