import { INews } from "../../custom";
import columnService from "../services/coolumnPublic.service";
import { Request, Response } from "express"

const columnByJournalist = async (req: Request, res: Response): Promise<Response | void> => {
    let limit = req.query.limit ? Number(req.query.limit) : 5;
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    const journalistId = res.locals.journalistId;

    try {
        const { column, nextOffset, hasMore } = await columnService.findColumnByJournalistService(journalistId, offset, limit);

        res.status(200).send({
            hasMore,
            nextOffset,
            column
        });
    } catch (err: any) {
        if (err.message === "No Column found")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const columnByCategory = async (req: Request, res: Response): Promise<Response | void> => {
    let limit = req.query.limit ? Number(req.query.limit) : 5;
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    const category = req.params.category;

    try {
        const { column, nextOffset, hasMore } = await columnService.findColumnByCategoryService(category, offset, limit);

        res.status(200).send({
            hasMore,
            nextOffset,
            column
        });
    } catch (err: any) {
        if (err.message === "No Column found")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default {
    columnByJournalist,
    columnByCategory
};