const userService = require("../services/user.service");
const mongoose = require("mongoose");

const validId = (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    next();
};

const validUser = async (req, res, next) => {
    const id = req.params.id;

    const user = await userService.findById(id);

    if (!user) {
        return res.status(400).send({ message: "User not found by ID" });
    }

    req.id = id;
    req.user = user;
    next();
};

//Error handling: if the email already has a registration
const validEmail = async (req, res, next) => {
    const { email } = req.body;

    const existingEmail = await userService.findByEmail(email);
    if (existingEmail) {
        return res.status(400).send({ message: "The provided email is already in use" });
    }

    next();
}

module.exports = { validId, validUser, validEmail };