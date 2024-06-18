import mongoose from "mongoose";
import { ReplyCommentModel, LikeReplyModel } from "../database/db.js"

const LikeReplySchema = new mongoose.Schema({
    dataReplyCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReplyComment",
        required: true,
    },
    replyCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReplyComment",
        required: true,
    },
    likes: {
        type: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                required: true
            },
        }]
    },
});

LikeReplySchema.post('save', async function () {
    await ReplyCommentModel.updateOne({ _id: this.dataReplyCommentId, "reply._id": this.replyCommentId },
        { $set: { "reply.$.likeCount": this.likes.length } });
});

LikeReplySchema.post('findOneAndUpdate', async function () {
    const likesId = this.getQuery();
    const likeReplyUpdate = await LikeReplyModel.findById(likesId);

    await ReplyCommentModel.updateOne({ _id: likeReplyUpdate.dataReplyCommentId, "reply._id": likeReplyUpdate.replyCommentId },
        { $set: { "reply.$.likeCount": likeReplyUpdate.likes.length } });
});

export default LikeReplySchema;