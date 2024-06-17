import mongoose from "mongoose";
import { NewsModel, CommentModel, ReplyCommentModel } from "../database/db.js"

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
                ref: "",
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

ReplyCommentSchema.post('findOneAndUpdate', async function () {
    const repliesId = this.getQuery();
    const replyUpdate = await ReplyCommentModel.findById(repliesId);

    await CommentModel.updateOne({ _id: replyUpdate.dataCommentId, "comment._id": replyUpdate.commentId },
        { $set: { "comment.$.replyCount": replyUpdate.reply.length } });
});

export default ReplyCommentSchema;