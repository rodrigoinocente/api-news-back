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

export default {
    createColumnService
};