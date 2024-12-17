import { Types } from "mongoose";
import { IColumn, INews, Paginated } from "../../custom";
import columnRepositories from "../repositories/columnPublic.repositories";

const findColumnByJournalistService = async (jounalistId: Types.ObjectId, offset: number, limit: number): Promise<Paginated> => {
    const column: IColumn[] = await columnRepositories.columnByJournalistRepositories(jounalistId, offset, limit);
    const total: number = await columnRepositories.countColumnByJournalistRepositories(jounalistId);

    const next = offset + limit;
    const hasMore = next < total ? true : false;
    const nextOffset = next

    if (column.length === 0) throw new Error("No Column found");

    return ({
        hasMore,
        nextOffset,
        column
    });
};

export default {
    findColumnByJournalistService
};