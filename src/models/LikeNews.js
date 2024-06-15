import mongoose from "mongoose";
import { NewsModel, LikeNewsModel } from "../database/db.js"

const LikeNewsSchema = new mongoose.Schema({
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
});

LikeNewsSchema.post('save', async function () {
    const news = await NewsModel.findById(this.newsId);
    news.likeCount = this.likes.length;
    await news.save();
});

LikeNewsSchema.post('findOneAndUpdate',  async function () {
    const likesId = this.getQuery();
    const dataLikeUpdate = await LikeNewsModel.findById(likesId);
    
    const news = await NewsModel.findById(dataLikeUpdate.newsId);
    news.likeCount = dataLikeUpdate.likes.length;
    await news.save();
});

export default LikeNewsSchema;