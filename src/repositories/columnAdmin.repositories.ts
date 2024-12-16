import { Types } from "mongoose";
import { IColumn } from "../../custom";
import { ColumnModel } from "../database/db";

const createColumnRepositories = async (body: any): Promise<IColumn> => (await ColumnModel.create(body)).populate("authorId");

const findColumnByIdRepositories = async (columnId: Types.ObjectId): Promise<IColumn | null> => await ColumnModel.findById(columnId).populate("authorId");

const upDateColumnRepositories = (columnId: Types.ObjectId, body: IColumn): Promise<IColumn | null> =>
    ColumnModel.findOneAndUpdate({ _id: columnId }, { ...body }, { new: true, });

const eraseColumnRepositories = (columnId: Types.ObjectId): Promise<IColumn | null> => ColumnModel.findOneAndDelete({ _id: columnId });

export default {
    createColumnRepositories,
    findColumnByIdRepositories,
    upDateColumnRepositories,
    eraseColumnRepositories
};