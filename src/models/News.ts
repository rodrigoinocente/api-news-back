import mongoose from "mongoose";
import { INews } from "../../custom";
import { categories } from "../../enum";

const NewsSchema = new mongoose.Schema<INews>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  bannerAlt: {
    type: String,
    required: true
  },
  bannerFigcaption: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Journalist",
    required: true
  },
  category: {
    type: String,
    enum: categories,
    required: true,
  },
  tags: {
    type: [String],
    required: true
  },
  commentCount: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    required: true
  },
  edited: {
    type: Date,
    default: null
  },
});

export default NewsSchema;