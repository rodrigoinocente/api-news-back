import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import JournalistSchema from "../models/Journalist";
import NewsSchema from "../models/News";
import ColumnSchema from "../models/ColumnSchema";
import { INews, IJournalist, IColumn } from "../../custom";

const connectDb = mongoose.createConnection(process.env.MONGODB_URI as string);

export const JournalistModel = connectDb.model<IJournalist>("Journalist", JournalistSchema, "journalist");
export const NewsModel = connectDb.model<INews>("News", NewsSchema, "news");
export const ColumnModel = connectDb.model<IColumn>("Column", ColumnSchema, "column");