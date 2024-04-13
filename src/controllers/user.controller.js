const userService = require("../services/user.service");

const create = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
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

    const user = req.user;
    res.send(user);
}

const update = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name && !username && !email && !password) {
        res.status(400).send({ message: "Submit at least one fields for update" });
    }

    const id = req.id;

    await userService.update(
        id,
        name,
        username,
        email,
        password
    );

    res.send({ message: "User successfully updated" });
};

module.exports = { create, findAllUser, findByEmail, findById, update };