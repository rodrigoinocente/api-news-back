import mongoose from "mongoose";
import { NewsModel, LikeNewsModel } from "../database/db"
import { INews, ILikeNews } from "../../custom";

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
    const news: INews | null = await NewsModel.findById(this.newsId);
    if (news) {
        news.likeCount = this.likes.length;
        await news.save();
    }
});

LikeNewsSchema.post('findOneAndUpdate', async function () {
    const likesId = this.getQuery();
    const dataLikeUpdate: ILikeNews | null = await LikeNewsModel.findById(likesId);
    if (dataLikeUpdate) {
        const news: INews | null = await NewsModel.findById(dataLikeUpdate.newsId);
        if (news) {
            news.likeCount = dataLikeUpdate.likes.length;
            await news.save();
        }
    }
});

export default LikeNewsSchema;