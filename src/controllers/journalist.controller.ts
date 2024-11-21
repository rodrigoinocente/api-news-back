import { Request, Response } from "express";
import journalistService from "../services/journalist.service";
import { IJournalist } from "../../custom";

const creatJournalist = async (req: Request, res: Response): Promise<Response | void> => {
    const body = req.body;

    try {
        await journalistService.createJournalistService(body);

        return res.status(201).send({ message: "Journalist created successfully", });
    } catch (err: any) {
        if (err.message === "Submit all fields for registration")
            return res.status(400).send({ message: err.message });

        if (err.message === "The provided email is already in use")
            return res.status(400).send({ message: err.message });

        if (err.message === "Error creating Journalist")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const findAllJournalist = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const journalists: IJournalist[] = await journalistService.findAllJournalistService();
        res.status(200).send(journalists);
    } catch (err: any) {
        if (err.message === "There are no registered journalist")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const findJournalistById = async (req: Request, res: Response): Promise<Response | void> => {
    const journalistId = res.locals.journalistId;

    try {
        const journalist = await journalistService.findJournalistByIdService(journalistId);

        return res.status(200).send(journalist);
    } catch (err: any) {
        if (err.message === "Journalist not found by ID")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const updateJournalist = async (req: Request, res: Response): Promise<Response | void> => {
    const journalistId = res.locals.journalistId;
    const body = req.body;

    try {
       await journalistService.updateJournalistService(journalistId, body);

        return res.status(200).send({ message: "Journalist successfully updated" });

    } catch (err: any) {
        if (err.message === "Submit at least one fields for update")
            return res.status(400).send({ message: err.message });
        
        if (err.message === "The provided email is already in use")
            return res.status(400).send({ message: err.message });
        
        if (err.message === "Error updating")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default {
    creatJournalist,
    findAllJournalist,
    findJournalistById,
    updateJournalist,
};