import { IColumn } from "../../custom";
import columnAdminService from "../services/columnAdmin.service";
import { Request, Response } from "express"

const createColumn = async (req: Request, res: Response): Promise<Response | void> => {
    const body = req.body;

    try {
        const column: IColumn = await columnAdminService.createColumnService(body);

        res.status(201).send(column);
    } catch (err: any) {
        if (err.message === "Submit all fields to post")
            return res.status(400).send({ message: err.message });
        
        if (err.message === "The value of authorId is incorrect")
            return res.status(400).send({ message: err.message });

        if (err.message === "Journalist not found")
            return res.status(404).send({ message: err.message });

        if (err.message === "Error creating Column")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const upDateColumn = async (req: Request, res: Response): Promise<Response | void> => {
    const columnId = res.locals.columnId;
    const body = req.body;

    try {
        const column: IColumn = await columnAdminService.updateColumnService(columnId, body);

        return res.status(200).send({
            message: "Column successfully updated",
            column
        });

    } catch (err: any) {
        if (err.message === "Submit at least one fields to update the Column")
            return res.status(400).send({ message: err.message });

        if (err.message === "Column not found")
            return res.status(404).send({ message: err.message });

        if (err.message === "Failed to update Column")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const eraseColumn = async (req: Request, res: Response): Promise<Response | void> => {
    const columnId = res.locals.columnId;

    try {
        const columnDeleted = await columnAdminService.eraseColumnService(columnId);

        return res.status(200).send({
            message: "Column deleted successfully",
            news: columnDeleted
        });

    } catch (err: any) {
        if (err.message === "Column not found")
            return res.status(404).send({ message: err.message });

        if (err.message === "Failed to delete Column")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default {
    createColumn,
    upDateColumn,
    eraseColumn
};