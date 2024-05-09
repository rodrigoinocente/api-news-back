import mongoose from "mongoose";

const LikesSchema = new mongoose.Schema({
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
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
    likeCount: {
        type: Number,
        default: 0,
    },
});

const LikesNews = mongoose.model("LikesNews", LikesSchema);

export default LikesNews;