import mongoose from "mongoose";
import { INews } from "../../custom";

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
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Journalist",
    required: true
  },
  category: {
    type: String,
    enum: ["Technology", "Sports", "Science", "Politics", "Health", "Art", "Others"],
    required: true,
  },
  tags: {
    type: [String],
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now()
  },
});

export default NewsSchema;