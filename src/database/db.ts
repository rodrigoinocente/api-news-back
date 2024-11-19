import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/User";
import NewsSchema from "../models/News";
import { INews, IUser } from "../../custom";

const connectDb = mongoose.createConnection(process.env.MONGODB_URI as any);

export const UserModel = connectDb.model<IUser>("User", UserSchema, "users");
export const NewsModel = connectDb.model<INews>("News", NewsSchema, "news");