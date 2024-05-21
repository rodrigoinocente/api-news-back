import userService from "../services/user.service.js";

const createUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).send({ message: "Submit all fields for registration" });
        }

        const createdUser = await userService.createService(req.body);

        if (!createdUser) {
            return res.status(400).send({ message: "Error creating User" });
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
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const findAllUser = async (req, res) => {
    try {
        const users = await userService.findAllUserService();

        if (users.length === 0) {
            return res.status(400).send({ message: "There are no registered users" });
        }

        res.send(users);

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const findByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userService.findByEmailService(email);

        if (!user) {
            return res.status(400).send({ message: "User not found by email" });
        }

        res.send(user);

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const findById = async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const update = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name && !username && !email && !password) {
            return res.status(400).send({ message: "Submit at least one fields for update" });
        }

        const userId = req.userId;

        await userService.updateService(
            userId,
            name,
            username,
            email,
            password
        );

        res.send({ message: "User successfully updated" });

    } catch (err) {
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