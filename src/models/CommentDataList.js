import mongoose from "mongoose";

const CommentDataListSchema = new mongoose.Schema({
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
    comment: {
        type: [{
            commentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comments",
                required: true,
            },
            _id: false
        }]
    },
    commentCount: {
        type: Number,
        default: 0,
    },
});

export default CommentDataListSchema;