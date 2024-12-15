import { IColumn } from "../../custom";
import { ColumnModel, NewsModel } from "../database/db";

const createColumnRepositories = async (body: any): Promise<IColumn> => (await ColumnModel.create(body)).populate("authorId");

export default {
    createColumnRepositories
};