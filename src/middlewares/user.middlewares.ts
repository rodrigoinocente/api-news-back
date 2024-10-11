import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import userRepositories from "../repositories/user.repositories";

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

const validUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userId = req.params.userId;

        if (!isValidObjectId(userId)) return res.status(400).send({ message: "Invalid ID" });

        const user = await userRepositories.findByIdRepositories(userId);
        if (!user) return res.status(404).send({ message: "User not found by ID" });

        res.locals.user = user;
        next();

    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

const validEmail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email } = req.body;

        const existEmail = await userRepositories.findByEmailRepositories(email);
        if (existEmail) return res.status(400).send({ message: "The provided email is already in use" });

        next();
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

export { validUser, validEmail };