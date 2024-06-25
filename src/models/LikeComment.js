import mongoose from "mongoose";
import { CommentModel, LikeCommentModel } from "../database/db.js"

const LikeCommentSchema = new mongoose.Schema({
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
            _id: false
        }]
    },
});

LikeCommentSchema.post('save', async function () {
    try {
        await CommentModel.updateOne({ _id: this.dataCommentId, "comment._id": this.commentId },
            { $set: { "comment.$.likeCount": this.likes.length } });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
});

LikeCommentSchema.post('findOneAndUpdate', async function () {
    try {
        const dataLikesId = this.getQuery();
        const dataLikesUpdate = await LikeCommentModel.findById(dataLikesId);

        await CommentModel.updateOne({ _id: dataLikesUpdate.dataCommentId, "comment._id": dataLikesUpdate.commentId },
            { $set: { "comment.$.likeCount": dataLikesUpdate.likes.length } });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
});

export default LikeCommentSchema;