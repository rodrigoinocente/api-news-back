import { IColumn } from "../../custom";
import { ColumnModel } from "../database/db";
import { Types } from 'mongoose';

const columnByJournalistRepositories = (jounalistId: Types.ObjectId, offset: number, limit: number): Promise<IColumn[] | []> =>
    ColumnModel.find({ authorId: jounalistId })
        .sort({ _id: -1 })
        .select("_id title subtitle publishedAt")
        .skip(offset).limit(limit);

const countColumnByJournalistRepositories = (jounalistId: Types.ObjectId): Promise<number> => ColumnModel.countDocuments({ authorId: jounalistId });

export default {
    columnByJournalistRepositories,
    countColumnByJournalistRepositories
};