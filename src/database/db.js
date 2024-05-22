import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/User.js"
import NewsSchema from "../models/News.js"
import LikeNewsSchema from "../models/LikeNews.js"

const userConn = mongoose.createConnection(process.env.MONGODB_URI_USERS);
const newsConn = mongoose.createConnection(process.env.MONGODB_URI_NEWS);
const likeConn = mongoose.createConnection(process.env.MONGODB_URI_LIKENEWS);

export const UserModel = userConn.model("User", UserSchema, "users");
export const NewsModel = newsConn.model("News", NewsSchema, "news");
export const LikeNewsModel = likeConn.model("LikeNews", LikeNewsSchema, "likes");