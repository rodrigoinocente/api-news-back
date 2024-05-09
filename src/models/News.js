import mongoose from "mongoose";

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
    dataLikes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LikesNews",
        default: null,
    },
    likeCount: {
        type: Number,
        default: 1,
    },
    dataComments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentsNews",
        default: null,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true,
    },
});

const News = mongoose.model("News", NewsSchema);

export default News;