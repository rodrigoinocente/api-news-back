import { Request, Response } from "express";
import userService from "../services/user.service";
import { IUser } from "../../custom";

const createUser = async (req: Request, res: Response): Promise<Response | void> => {
    const body = req.body;

    try {
        const { user, token } = await userService.createUserService(body);

        return res.status(201).send({
            message: "User created successfully",
            user,
            token
        });
    } catch (err: any) {
        if (err.message === "Submit all fields for registration")
            return res.status(400).send({ message: err.message });

        if (err.message === "Error creating User")
            return res.status(500).send({ message: "Server error while creating user" });

        return res.status(500).send({ message: "An unexpected error occurred" }); /* TODO: Add in Swagger */
    };
};

const findAllUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const users: IUser[] = await userService.findAllUserService();
        res.status(200).send(users);
    } catch (err: any) {
        if (err.message === "There are no registered users")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" }); /* TODO: Add in Swagger */
    };
};

const findByEmail = async (req: Request, res: Response): Promise<Response | void> => {
    const email = req.params.email;

    try {
        const user: IUser | null = await userService.findByEmailService(email);

        res.status(200).send(user);
    } catch (err: any) {
        if (err.message === "User not found by email")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" }); /* TODO: Add in Swagger */
    };
};

const findById = async (req: Request, res: Response): Promise<Response | void> => {
    const userId = req.params.userId;

    try {
        const user = await userService.findByIdService(userId);

        return res.status(200).send(user);
    } catch (err: any) {
        if (err.message === "User not found by id")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" }); /* TODO: Add in Swagger */
    };
};

const update = async (req: Request, res: Response): Promise<Response | void> => {
    const userToFoundId = req.params.userId;
    const userLoggedId = res.locals.userId;
    const body = req.body;

    try {
        const user = await userService.updateService(userToFoundId, userLoggedId, body);

        return res.status(200).send({ message: "User successfully updated", user });

    } catch (err: any) {
        if (err.message === "Submit at least one fields for update")
            return res.status(400).send({ message: err.message });

        if (err.message === "You didn't update this user")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" }); /* TODO: Add in Swagger */
    };
};

export default {
    createUser,
    findAllUser,
    findByEmail,
    findById,
    update
};