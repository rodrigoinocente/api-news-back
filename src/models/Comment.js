import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    commentLikeData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "",
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true,
    },
});

export default CommentSchema;