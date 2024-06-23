import mongoose from "mongoose";
import { NewsModel, CommentModel, LikeCommentModel, ReplyCommentModel, LikeReplyModel } from "../database/db.js"
import newsService from "../services/news.service.js";

const CommentSchema = new mongoose.Schema({
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
    comment: {
        type: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            dataLike: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "LikeComment",
                default: null,
            },
            dataReply: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ReplyComment",
                default: null,
            },
            likeCount: {
                type: Number,
                default: 0,
            },
            replyCount: {
                type: Number,
                default: 0,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                required: true
            },
        }]
    },
});

CommentSchema.post('save', async function () {
    const news = await NewsModel.findById(this.newsId);
    news.commentCount = this.comment.length;
    await news.save();
});

CommentSchema.post('findOneAndUpdate', async function () { await updateCommentCountFromNews(this) });

CommentSchema.post('updateMany', async function () { await updateCommentCountFromNews(this) });

CommentSchema.pre('updateMany', async function (next) {
    const { _id: dataCommentId } = this.getQuery();
    const { $pull: { comment: { _id: commentId } } } = this.getUpdate();

    const comment = await newsService.findCommentById(dataCommentId, commentId);
    if (comment.comment[0].dataLike) await LikeCommentModel.deleteOne(comment.comment[0].dataLike)
    if (comment.comment[0].dataReply) {
        const replies = await ReplyCommentModel.findById(comment.comment[0].dataReply);
        for (const reply of replies.reply) if (reply.dataLike) await LikeReplyModel.deleteOne(reply.dataLike);

        await ReplyCommentModel.deleteOne(comment.comment[0].dataReply);
    };
    next();
});

const updateCommentCountFromNews = async (thisContext) => {
    const { _id: dataCommentId } = thisContext.getQuery();

    const getReplyLength = await CommentModel.aggregate([
        { $match: { _id: dataCommentId } },
        { $project: { "_id": 0, "newsId": 1, "commentCount": { $size: "$comment" } } }
    ]);

    const news = await NewsModel.findById(getReplyLength[0].newsId);
    news.commentCount = getReplyLength[0].commentCount;
    await news.save();
};

export default CommentSchema;