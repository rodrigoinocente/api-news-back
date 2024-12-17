import { IColumn } from "../../custom";
import { ColumnModel } from "../database/db";
import { Types } from 'mongoose';

const columnByJournalistRepositories = (jounalistId: Types.ObjectId, offset: number, limit: number): Promise<IColumn[] | []> =>
    ColumnModel.find({ authorId: jounalistId })
        .sort({ _id: -1 })
        .select("_id title subtitle publishedAt")
        .skip(offset).limit(limit);

const countColumnByJournalistRepositories = (jounalistId: Types.ObjectId): Promise<number> => ColumnModel.countDocuments({ authorId: jounalistId });

const columnByCategoryRepositories = (category: string, offset: number, limit: number): Promise<IColumn[] | []> =>
    ColumnModel.find({ category: category })
        .sort({ _id: -1 })
        .select("_id title subtitle publishedAt")
        .skip(offset).limit(limit);

const countColumnByCategoryRepositories = (category: string): Promise<number> => ColumnModel.countDocuments({ category: category });


export default {
    columnByJournalistRepositories,
    countColumnByJournalistRepositories,
    columnByCategoryRepositories,
    countColumnByCategoryRepositories
};