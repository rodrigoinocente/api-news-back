import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/User.js"
import NewsSchema from "../models/News.js"
import LikeNewsSchema from "../models/LikeNews.js"
import CommentSchema from "../models/Comment.js"
import LikeCommentSchema from "../models/LikeComment.js"

const connectDb = mongoose.createConnection(process.env.MONGODB_URI);


export const UserModel = connectDb.model("User", UserSchema, "users");
export const NewsModel = connectDb.model("News", NewsSchema, "news");
export const LikeNewsModel = connectDb.model("LikeNews", LikeNewsSchema, "likesNews");
export const CommentModel = connectDb.model("Comment", CommentSchema, "comments");
export const LikeCommentModel = connectDb.model("LikeComment", LikeCommentSchema, "likesComment");
