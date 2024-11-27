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
    enum: ["Tecnologia", "Esportes", "Ciência", "Política", "Saúde", "Arte", "Outros"],
    required: true,
  },
  tags: {
    type: [String],
    required: true
  },
  commentCount:{
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now()
  },
});

export default NewsSchema;