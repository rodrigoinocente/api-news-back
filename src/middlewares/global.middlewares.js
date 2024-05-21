import userService from "../services/user.service.js";
import mongoose from "mongoose";

const validId = (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ message: "Invalid ID" });
        }

        next();

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const validUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await userService.findByIdService(userId);

        if (!user) {
            return res.status(400).send({ message: "User not found by ID" });
        }

        req.userId = userId;
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