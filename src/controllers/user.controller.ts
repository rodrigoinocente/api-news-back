import { Request, Response } from "express";
import userService from "../services/user.service";
import { IUser } from "../../custom";

const createUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).send({ message: "Submit all fields for registration" });
        }

        const createdUser: IUser = await userService.createService(req.body);

        if (!createdUser) {
            return res.status(500).send({ message: "Error creating User" });
        }

        res.status(201).send({
            message: "User created successfully",
            user: {
                id: createdUser._id,
                name,
                username,
                email
            }
        });
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

const findAllUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const users: IUser[] = await userService.findAllUserService();
        if (users.length === 0) return res.status(404).send({ message: "There are no registered users" });

        res.send(users);
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

const findByEmail = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const email = req.params.email;
        const user: IUser | null = await userService.findByEmailService(email);

        if (!user) return res.status(400).send({ message: "User not found by email" });

        res.send(user);
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

const findById = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const user: IUser = res.locals.user;
        res.send(user);

    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

const update = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { name, username, email, password } = req.body;

        if (!name && !username && !email && !password) {
            return res.status(400).send({ message: "Submit at least one fields for update" });
        }

        if (req.params.userId !== String(res.locals.userId)) {
            return res.status(403).send({ message: "You didn't update this post" });
        }
        const userId = res.locals.userId;

        await userService.updateService(
            userId,
            name,
            username,
            email,
            password
        );

        res.status(200).send({ message: "User successfully updated" });

    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

export default {
    createUser,
    findAllUser,
    findByEmail,
    findById,
    update
};