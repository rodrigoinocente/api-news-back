import userService from "../services/user.service.js";
import mongoose from "mongoose";

const validId = (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID" });
        }

        next();

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const validUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await userService.findByIdService(id);

        if (!user) {
            return res.status(400).send({ message: "User not found by ID" });
        }

        req.id = id;
        req.user = user;
        next();

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

//Error handling: if the email already has a registration
const validEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existingEmail = await userService.findByEmailService(email);

        if (existingEmail) {
            return res.status(400).send({ message: "The provided email is already in use" });
        }

        next();

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

export { validId, validUser, validEmail };