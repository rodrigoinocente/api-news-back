import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/User.js"
import NewsSchema from "../models/News.js"
import LikeNewsSchema from "../models/LikeNews.js"
import CommentDataListSchema from "../models/CommentDataList.js"
import CommentSchema from "../models/Comment.js"

const userConn = mongoose.createConnection(process.env.MONGODB_URI_USERS);
const newsConn = mongoose.createConnection(process.env.MONGODB_URI_NEWS);
const likeConn = mongoose.createConnection(process.env.MONGODB_URI_LIKENEWS);
const CommentDataListConn = mongoose.createConnection(process.env.MONGODB_URI_COMMENTDATALIST);
const commentsConn = mongoose.createConnection(process.env.MONGODB_URI_COMMENTS);

export const UserModel = userConn.model("User", UserSchema, "users");
export const NewsModel = newsConn.model("News", NewsSchema, "news");
export const LikeNewsModel = likeConn.model("LikeNews", LikeNewsSchema, "likes");
export const CommentDataListModel = CommentDataListConn.model("CommentDataList", CommentDataListSchema, "commentDataList");
export const CommentModel = commentsConn.model("Comment", CommentSchema, "comments");
