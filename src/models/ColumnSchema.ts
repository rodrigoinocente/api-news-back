import mongoose from "mongoose";
import { IColumn } from "../../custom";
import { categories } from "../../enum";

const ColumnSchema = new mongoose.Schema<IColumn>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Journalist",
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  category: {
    type: String,
    enum: categories,
    required: true,
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

export default ColumnSchema;