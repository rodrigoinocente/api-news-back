import { NewsModel, LikeNewsModel, CommentModel/* , CommentDataListModel, LikeCommentModel */ } from "../database/db.js";

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

const isUserInArray = (likesId, userId) => LikeNewsModel.exists({ _id: likesId, "likes.userId": [userId] });

const likeNewsService = (likesId, userId) => LikeNewsModel.findOneAndUpdate({ _id: likesId },
    { $push: { likes: { userId } } });

const deleteLikeNewsService = (likesId, userId) => LikeNewsModel.findOneAndUpdate({ _id: likesId }, { $pull: { likes: { userId } } });

const totalLikesLengthService = async (dataLikeId) => {
    const findArray = await LikeNewsModel.aggregate([{ $match: { _id: dataLikeId } },
    { $unwind: "$likes" },
    { $count: "likes" }]);
    return findArray[0].likes;
};

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

const upDateCommentDataService = async (commentDataId, userId, content) => {
    await CommentModel.findOneAndUpdate({ _id: commentDataId }, { $push: { comment: [{ userId, content }] } });
};

const deleteCommentService = async (commentDataId, commentId) => {
    await CommentModel.findOneAndUpdate({ _id: commentDataId }, { $pull: { comment: { _id: commentId } } });
};

const findCommentById = (dataCommentId, commentId) => CommentModel.findOne(
    { _id: dataCommentId, "comment._id": commentId }, { "comment.$": 1 });

const getAllCommentsByNewsId = (newsId) => CommentModel.find({ newsId: newsId });

const totalCommentLengthService = async (dataCommentId) => {
    const findArray = await CommentModel.aggregate([{ $match: { _id: dataCommentId } },
    { $unwind: "$comment" },
    { $count: "comment" }]);
    return findArray[0].comment;
};

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
                "_id": 0,
            },
        },
    ]
    );
};

const createCommentDataLikeService = async (commentId, userId) => {
    const newDataLike = await LikeCommentModel.create({ commentId, likes: { userId } });
    await CommentModel.findOneAndUpdate({ _id: commentId }, { $set: { dataLike: newDataLike } })
};

const likeCommentService = (likesId, userId) => LikeCommentModel.findOneAndUpdate(
    { _id: likesId, likes: { $nin: { userId } } }, { $push: { likes: { userId } } });

const deleteLikeCommentService = (likesId, userId) => LikeCommentModel.findOneAndUpdate({ _id: likesId },
    { $pull: { likes: { userId } } });

const addReplyToCommentService = (id, idComment, userId, reply) => {
    const idReply = Math.floor(Date.now() * Math.random()).toString(36);
    const createdAt = new Date();
    return News.findOneAndUpdate(
        { _id: id, "comment.idComment": idComment },
        { $push: { "commecommentnts.$.replies": { idReply, userId, reply, createdAt } } }
    );
};

const deleteReplyService = (id, idComment, idReply, userId) => News.findOneAndUpdate({ _id: id, "comment.idComment": idComment },
    { $pull: { "comment.$.replies": { idReply, userId } } });

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
    addReplyToCommentService,
    deleteReplyService,
    createNewsDataLikeService,
    createCommentDataService,
    upDateCommentDataService,
    findCommentById,
    getAllCommentsByNewsId,
    createCommentDataLikeService,
    likeCommentService,
    totalCommentLengthService,
    commentsPipelineService,
    isUserInArray,
    totalLikesLengthService,
    likesPipelineService
};