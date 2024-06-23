import mongoose from "mongoose";
import { CommentModel, LikeReplyModel, ReplyCommentModel } from "../database/db.js"
import newsService from "../services/news.service.js";

const ReplyCommentSchema = new mongoose.Schema({
    dataCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },
    reply: {
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
                ref: "LikeReply",
                default: null,
            },
            likeCount: {
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

ReplyCommentSchema.post('save', async function () {
    await CommentModel.updateOne({ _id: this.dataCommentId, "comment._id": this.commentId },
        { $set: { "comment.$.replyCount": this.reply.length } });
});

ReplyCommentSchema.post('findOneAndUpdate', async function () { await updateReplyCountFromComment(this) });

ReplyCommentSchema.post('updateMany', async function () { await updateReplyCountFromComment(this) });

ReplyCommentSchema.pre('updateMany', async function (next) {
    const { _id: dataReplyId } = this.getQuery();
    const { $pull: { reply: { _id: replyId } } } = this.getUpdate();

    const reply = await newsService.findReplyById(dataReplyId, replyId)
    const replyDataLike = reply.reply[0].dataLike;
    if (replyDataLike) await LikeReplyModel.deleteOne(replyDataLike)
    next();
});

const updateReplyCountFromComment = async (thisContext) => {
    const { _id: dataReplyId } = thisContext.getQuery();

    const getReplyLength = await ReplyCommentModel.aggregate([{ $match: { _id: dataReplyId } },
    { $project: { "_id": 0, "dataCommentId": 1, "commentId": 1, "replyCount": { $size: "$reply" } } }
    ]);

    await CommentModel.updateOne({ _id: getReplyLength[0].dataCommentId, "comment._id": getReplyLength[0].commentId },
        { $set: { "comment.$.replyCount": getReplyLength[0].replyCount } });
};

export default ReplyCommentSchema;