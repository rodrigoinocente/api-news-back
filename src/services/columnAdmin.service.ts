import { Types } from "mongoose";
import { IColumn } from "../../custom";
import columnAdminRepositories from "../repositories/columnAdmin.repositories";
import journalistRepositories from "../repositories/journalist.repositories";

const createColumnService = async (body: IColumn): Promise<IColumn> => {
    let { title, content, authorId, category, tags } = body;
    if (!title || !content || !authorId || !category || !tags)
        throw new Error("Submit all fields to post");

    if (!Types.ObjectId.isValid(authorId)) throw new Error("The value of authorId is incorrect")

    const journalist = await journalistRepositories.findJournalistByIdRepositories(authorId)
    if (!journalist) throw new Error("Journalist not found")

    const column: IColumn = await columnAdminRepositories.createColumnRepositories({
        ...body,
        publishedAt: new Date()
    })
    if (!column) throw new Error("Error creating Column")

    return column
};

const updateColumnService = async (columnId: Types.ObjectId, body: IColumn): Promise<IColumn> => {
    const { title, content, authorId, category, tags } = body;

    if (!title && !content && !authorId && !category && !tags)
        throw new Error("Submit at least one fields to update the Column");

    const column: IColumn | null = await columnAdminRepositories.findColumnByIdRepositories(columnId);
    if (!column) throw new Error("Column not found");

    body = { ...body, edited: new Date() }

    const columnUpdate: IColumn | null = await columnAdminRepositories.upDateColumnRepositories(columnId, body);
    if (!columnUpdate) throw new Error("Failed to update Column");

    return columnUpdate;
};

const eraseColumnService = async (columnId: Types.ObjectId): Promise<IColumn> => {
    const news: IColumn | null = await columnAdminRepositories.findColumnByIdRepositories(columnId)
    if (!news) throw new Error("Column not found");

    const columnDeleted = await columnAdminRepositories.eraseColumnRepositories(columnId);
    if (!columnDeleted) throw new Error("Failed to delete Column");

    return columnDeleted;
};


export default {
    createColumnService,
    updateColumnService,
    eraseColumnService
};