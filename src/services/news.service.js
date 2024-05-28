import { NewsModel, UserModel, LikeNewsModel, CommentModel, CommentDataListModel, LikeCommentModel } from "../database/db.js";

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

const createNewsDataLikeService = async (newsId, userId) => {
    const newDataLike = await LikeNewsModel.create({ newsId, likes: { userId } });
    await NewsModel.findOneAndUpdate({ _id: newsId }, { $set: { dataLike: newDataLike } })
};

const likeNewsService = (likesId, userId) => LikeNewsModel.findOneAndUpdate(
    { _id: likesId, likes: { $nin: { userId } } }, { $push: { likes: { userId } } });

const deleteLikeNewsService = (likesId, userId) => LikeNewsModel.findOneAndUpdate({ _id: likesId }, { $pull: { likes: { userId } } });

const createCommentService = (newsId, userId, comment) => CommentModel.create({ newsId, userId, comment });

const createCommentDataListService = async (newsId, commentId) => {
    const newCommentDataList = await CommentDataListModel.create({ newsId, comment: [{ commentId }] });
    await NewsModel.findOneAndUpdate({ _id: newsId }, { $set: { dataComment: newCommentDataList._id } });
};

const upDateCommentDataListService = (dataCommentId, commentId) => CommentDataListModel.findOneAndUpdate({ _id: dataCommentId },
    { $push: { comment: { commentId } } });

const deleteCommentService = async (commentId, commentDataId) => {
    await CommentModel.findOneAndDelete({ _id: commentId })
    await CommentDataListModel.findByIdAndUpdate({ _id: commentDataId }, { $pull: { comment: { commentId: commentId } } })
};

const findCommentById = (commentId) => CommentModel.findById(commentId);

const getAllCommentsByNewsId = (newsId) => CommentModel.find({ newsId: newsId });

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
    deleteLikeCommentService,
    deleteLikeNewsService,
    deleteCommentService,
    addReplyToCommentService,
    deleteReplyService,
    createNewsDataLikeService,
    createCommentService,
    createCommentDataListService,
    upDateCommentDataListService,
    findCommentById,
    getAllCommentsByNewsId,
    createCommentDataLikeService,
    likeCommentService
};