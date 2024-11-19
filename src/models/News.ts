import mongoose from "mongoose";
import { INews } from "../../custom";

const NewsSchema = new mongoose.Schema<INews>({
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
    required: true
  },
  dataLikeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LikeNews",
    default: null,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  dataCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommentDataList",
    default: null,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

export default NewsSchema;
