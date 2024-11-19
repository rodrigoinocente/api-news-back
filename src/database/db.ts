import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/Journalist";
import NewsSchema from "../models/News";
import { INews, IJournalist } from "../../custom";

const connectDb = mongoose.createConnection(process.env.MONGODB_URI as any);

export const JournalistModel = connectDb.model<IJournalist>("Journalist", UserSchema, "journalist");
export const NewsModel = connectDb.model<INews>("News", NewsSchema, "news");