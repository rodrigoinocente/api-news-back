const userService = require("../services/user.service")
const mongoose = require("mongoose")

const create = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name | !username | !email | !password) {
        res.status(400).send({ message: "Submit all fields for registration" });
    }

    const user = await userService.create(req.body);

    if (!user) {
        return res.status(400).send({ message: "Error creating User" });
    }

    res.status(201).send({
        message: "User created successfully",
        user: {
            id: user._id,
            name,
            username,
            email
        }
    });
}

const findAllUser = async (req, res) => {
    const users = await userService.findAllUser();

    if (users.length === 0) {
        return res.status(400).send({ message: "There are no registered users" });
    }

    res.send(users);
}

const findByEmail = async (req, res) => {
    const email = req.params.email;

    const user = await userService.findByEmail(email);

    if (!user) {
        return res.status(400).send({ message: "User not found by email" });
    }

    res.send(user);
}

const findById = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }
    
    const user = await userService.findById(id);


    if (!user) {
        return res.status(400).send({ message: "User not found by ID" });
    }

    res.send(user);
}

module.exports = { create, findAllUser, findByEmail, findById };