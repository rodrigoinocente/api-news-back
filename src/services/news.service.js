import { NewsModel, LikeNewsModel, CommentModel, LikeCommentModel, ReplyCommentModel, LikeReplyModel } from "../database/db.js";

const createNewsService = (body) => NewsModel.create(body);

const findAllNewsService = (offset, limit) => NewsModel.find().sort({ _id: -1 }).skip(offset).limit(limit)
    .populate("user");

const countNewsService = () => NewsModel.countDocuments();

const topNewsService = () => NewsModel.findOne().sort({ _id: -1 }).populate("user");

const findByIdService = (newsId) => NewsModel.findById(newsId).populate("user");

const searchByTitleService = (title) => NewsModel.find({ title: { $regex: `${title || ""}`, $options: "i" } })
    .sort({ _id: -1 })
    .populate("user");

const newsByUserService = (userId) => NewsModel.find({ user: userId }).sort({ _id: -1 }).populate("user");

const upDateService = (newsId, title, text, banner) => NewsModel.findOneAndUpdate({ _id: newsId },
    { title, text, banner },
    { rawResult: true, });

const eraseService = (newsId) => NewsModel.findOneAndDelete({ _id: newsId });

const createNewsDataLikeService = async (newsId, userId) => {
    const newDataLike = await LikeNewsModel.create({ newsId, likes: { userId } });
    await NewsModel.findOneAndUpdate({ _id: newsId }, { $set: { dataLike: newDataLike } });
};

const isUserInLikeNewsArray = (likesId, userId) => LikeNewsModel.exists({ _id: likesId, "likes.userId": [userId] });

const likeNewsService = (likesId, userId) => LikeNewsModel.findOneAndUpdate({ _id: likesId },
    { $push: { likes: { userId } } });

const deleteLikeNewsService = (likesId, userId) => LikeNewsModel.findOneAndUpdate({ _id: likesId }, { $pull: { likes: { userId } } });

const likesPipelineService = (dataCommentId, offset, limit) => {
    return LikeNewsModel.aggregate([
        { $match: { _id: dataCommentId } },
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

const createCommentDataService = async (newsId, userId, content) => {
    const newCommentDataList = await CommentModel.create({ newsId, comment: [{ userId, content }] });
    await NewsModel.findOneAndUpdate({ _id: newsId }, { $set: { dataComment: newCommentDataList._id } });
};

const upDateCommentDataService = async (dataCommentId, userId, content) => {
    await CommentModel.findOneAndUpdate({ _id: dataCommentId }, { $push: { comment: [{ userId, content }] } });
};

const deleteCommentService = async (dataCommentId, commentId) => {
    await CommentModel.findOneAndUpdate({ _id: dataCommentId }, { $pull: { comment: { _id: commentId } } });
};

const findCommentById = (dataCommentId, commentId) => CommentModel.findOne(
    { _id: dataCommentId, "comment._id": commentId }, { "comment.$": 1 });

const commentsPipelineService = (dataCommentId, offset, limit) => {
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

const createLikeCommentDataService = async (dataCommentId, commentId, userId) => {
    const newDataLike = await LikeCommentModel.create({ dataCommentId, commentId, likes: { userId } });
    await CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataLike": newDataLike._id } });
};

const isUserInLikeCommentArray = (dataLikeCommentId, userId) => LikeCommentModel.exists({ _id: dataLikeCommentId, "likes.userId": [userId] });

const likeCommentService = (dataLikeCommentId, userId) => LikeCommentModel.findOneAndUpdate(
    { _id: dataLikeCommentId }, { $push: { likes: { userId } } });

const deleteLikeCommentService = (dataLikeCommentId, userId) => LikeCommentModel.findOneAndUpdate({ _id: dataLikeCommentId },
    { $pull: { likes: { userId } } });

const createReplyCommentDataService = async (dataCommentId, commentId, userId, content) => {
    const newDataReply = await ReplyCommentModel.create({ dataCommentId, commentId, reply: { userId, content } });
    await CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataReply": newDataReply._id } });
};

const upDateReplyCommentDataService = async (commentDataReplyId, userId, content) => {
    await ReplyCommentModel.findOneAndUpdate({ _id: commentDataReplyId }, { $push: { reply: [{ userId, content }] } });
};

const findReplyById = (dataReplyId, replyId) => {
    return ReplyCommentModel.aggregate(
        [{ $match: { _id: dataReplyId, } }, { $unwind: { path: "$reply" } },
        { $match: { "reply._id": replyId } }]
    )
};

const deleteReplyCommentService = async (dataReplyId, replyId) => {
    await ReplyCommentModel.updateMany({ _id: dataReplyId }, { $pull: { reply: { _id: replyId } } });
};

const replyCommentsPipelineService = (dataReplyCommentId, offset, limit) => {
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

const createLikeReplyDataService = async (dataReplyCommentId, replyCommentId, userId) => {
    const newDataLike = await LikeReplyModel.create({ dataReplyCommentId, replyCommentId, likes: { userId } });
    await ReplyCommentModel.findOneAndUpdate({ _id: dataReplyCommentId, "reply._id": replyCommentId }, { $set: { "reply.$.dataLike": newDataLike._id } });
};

const isUserInLikeReplyArray = (replyDataLikeId, userId) => LikeReplyModel.exists({ _id: replyDataLikeId, "likes.userId": [userId] });

const likeReplyService = (replyDataLikeId, userId) => LikeReplyModel.findOneAndUpdate(
    { _id: replyDataLikeId }, { $push: { likes: { userId } } });

const deleteLikeReplyService = (replyDataLikeId, userId) => LikeReplyModel.findOneAndUpdate({ _id: replyDataLikeId },
    { $pull: { likes: { userId } } });

export default {
    createNewsService,
    findAllNewsService,
    countNewsService,
    topNewsService,
    findByIdService,
    searchByTitleService,
    newsByUserService,
    upDateService,
    eraseService,
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