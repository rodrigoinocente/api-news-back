import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/User.js"
import NewsSchema from "../models/News.js"

const userConn = mongoose.createConnection(process.env.MONGODB_URI_USERS);
const newsConn = mongoose.createConnection(process.env.MONGODB_URI_NEWS);

export const UserModel = userConn.model("User", UserSchema, "users");
export const NewsModel = newsConn.model("News", NewsSchema, "news");