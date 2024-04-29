import News from "../models/News.js";

const createService = (body) => News.create(body);

const findAllService = (offset, limit) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const countNewsService = () => News.countDocuments();

const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

const findByIdService = (id) => News.findById(id).populate("user");

const searchByTitleService = (title) => News.find({ title: { $regex: `${title || ""}`, $options: "i" } })
    .sort({ _id: -1 })
    .populate("user");

const byUserService = (id) => News.find({ user: id }).sort({ _id: -1 }).populate("user");

const upDateService = (id, title, text, banner) => News.findOneAndUpdate({ _id: id },
    { title, text, banner },
    { rawResult: true, });

const eraseService = (id) => News.findOneAndDelete({ _id: id });

const likeNewsService = (id, userId) => News.findOneAndUpdate(
    { _id: id, "likes.userId": { $nin: [userId] } }, { $push: { likes: { userId, created: new Date() } } });

const deletelikeNewsService = (id, userId) => News.findOneAndUpdate({ _id: id }, { $pull: { likes: { userId } } });

const addCommentService = (id, userId, comment) => {
    const idComment = Math.floor(Date.now() * Math.random()).toString(36);
    const createdAt = new Date();
    return News.findOneAndUpdate({ _id: id }, { $push: { comments: { idComment, userId, comment, createdAt } } });
};

const deleteCommentService = (id, idComment, userId) => News.findOneAndUpdate({ _id: id }, 
    { $pull: { comments: { idComment, userId } } });

export default {
    createService,
    findAllService,
    countNewsService,
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
    upDateService,
    eraseService,
    likeNewsService,
    deletelikeNewsService,
    addCommentService,
    deleteCommentService
};