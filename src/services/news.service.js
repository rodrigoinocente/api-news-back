import { NewsModel, UserModel, LikeNewsModel } from "../database/db.js";
import LikesNews from "../models/LikeNews.js";

const createNewsService = (body) => NewsModel.create(body);

const findAllNewsService = (offset, limit) => NewsModel.find().sort({ _id: -1 }).skip(offset).limit(limit)
    .populate({ path: "user", model: UserModel });

const countNewsService = () => NewsModel.countDocuments();

const topNewsService = () => NewsModel.findOne().sort({ _id: -1 }).populate({ path: "user", model: UserModel });

const findByIdService = (idNews) => NewsModel.findById(idNews).populate({ path: "user", model: UserModel });

const searchByTitleService = (title) => NewsModel.find({ title: { $regex: `${title || ""}`, $options: "i" } })
    .sort({ _id: -1 })
    .populate({ path: "user", model: UserModel });

const newsByUserService = (userId) => NewsModel.find({ user: userId }).sort({ _id: -1 }).populate({ path: "user", model: UserModel });

const upDateService = (newsId, title, text, banner) => NewsModel.findOneAndUpdate({ _id: newsId },
    { title, text, banner },
    { rawResult: true, });

const eraseService = (newsId) => NewsModel.findOneAndDelete({ _id: newsId });

const createDataLikeService = (newsId, userId) => LikeNewsModel.create({ newsId, likes: { userId } });

const updateDataLikeService = (newsId, dataLike) => NewsModel.findOneAndUpdate(
    { _id: newsId }, { $set: { dataLike: dataLike } });

const likeNewsService = (likesId, userId) => LikeNewsModel.findOneAndUpdate(
    { _id: likesId, likes: { $nin: { userId } } }, { $push: { likes: { userId } } });

const deletelikeNewsService = (likesId, userId) => LikeNewsModel.findOneAndUpdate({ _id: likesId }, { $pull: { likes: { userId } } });

const likeCommentService = (id, idComment, userId) => News.findOneAndUpdate(
    { _id: id, "comments.idComment": idComment, "comments.likes.userId": { $nin: [userId] } },
    { $push: { "comments.$.likes": { userId, created: new Date() } } });

const deletelikeCommentService = (id, idComment, userId) => News.findOneAndUpdate(
    { _id: id, "comments.idComment": idComment }, { $pull: { "comments.$.likes": { userId } } });

const addCommentService = (id, userId, comment) => {
    const idComment = Math.floor(Date.now() * Math.random()).toString(36);
    const createdAt = new Date();
    return News.findOneAndUpdate({ _id: id }, { $push: { comments: { idComment, userId, comment, createdAt } } });
};

const deleteCommentService = (id, idComment, userId) => News.findOneAndUpdate({ _id: id },
    { $pull: { comments: { idComment, userId } } });

const addReplyToCommentService = (id, idComment, userId, reply) => {
    const idReply = Math.floor(Date.now() * Math.random()).toString(36);
    const createdAt = new Date();
    return News.findOneAndUpdate(
        { _id: id, "comments.idComment": idComment },
        { $push: { "comments.$.replies": { idReply, userId, reply, createdAt } } }
    );
};

const deleteReplyService = (id, idComment, idReply, userId) => News.findOneAndUpdate({ _id: id, "comments.idComment": idComment },
    { $pull: { "comments.$.replies": { idReply, userId } } });

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
    likeCommentService,
    deletelikeCommentService,
    deletelikeNewsService,
    addCommentService,
    deleteCommentService,
    addReplyToCommentService,
    deleteReplyService,
    createDataLikeService,
    updateDataLikeService
};