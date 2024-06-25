import mongoose from "mongoose";
import newsService from "../services/news.service.js";
import { CommentModel, LikeCommentModel, LikeNewsModel, LikeReplyModel, ReplyCommentModel } from "../database/db.js";

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dataLike: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LikeNews",
        default: null,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    dataComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentDataList",
        default: null,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true,
    },
});
NewsSchema.pre('findOneAndDelete', async function (next) {
    try {
        const { _id: newsId } = this.getQuery();

        const news = await newsService.findNewsByIdService(newsId);
        if (news.dataLike) await LikeNewsModel.deleteOne(news.dataLike)
        if (news.dataComment) {
            const comments = await CommentModel.findById(news.dataComment);
            if (comments) {
                for (const comment of comments.comment) {
                    if (comment.dataLike) await LikeCommentModel.deleteOne(comment.dataLike);
                    if (comment.dataReply) {
                        const replies = await ReplyCommentModel.findById(comment.dataReply);
                        if (replies) {
                            for (const reply of replies.reply) {
                                if (reply.dataLike) await LikeReplyModel.deleteOne(reply.dataLike);
                            }
                            await ReplyCommentModel.deleteOne(comment.dataReply);
                        }
                    }
                };
                await CommentModel.deleteOne(news.dataComment)
            }
        }
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
});
export default NewsSchema;