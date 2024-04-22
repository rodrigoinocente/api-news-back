import userService from "../services/user.service.js"

const create = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            res.status(400).send({ message: "Submit all fields for registration" });
        }

        const user = await userService.createService(req.body);

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
    } catch (err) { res.status(500).send({ message: err.message }) }
}

const findAllUser = async (req, res) => {
    try {
        const users = await userService.findAllUserService();

        if (users.length === 0) {
            return res.status(400).send({ message: "There are no registered users" });
        }

        res.send(users);
    } catch (err) { res.status(500).send({ message: err.message }) }
}

const findByEmail = async (req, res) => {
    try {
        const email = req.params.email;

        const user = await userService.findByEmailService(email);

        if (!user) {
            return res.status(400).send({ message: "User not found by email" });
        }

        res.send(user);
    } catch (err) { res.status(500).send({ message: err.message }) }
}

const findById = async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) { res.status(500).send({ message: err.message }) }
}

const update = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name && !username && !email && !password) {
            res.status(400).send({ message: "Submit at least one fields for update" });
        }

        const id = req.id;

        await userService.updateService(
            id,
            name,
            username,
            email,
            password
        );

        res.send({ message: "User successfully updated" });
    } catch (err) { res.status(500).send({ message: err.message }) }
};

export default { create, 
    findAllUser, 
    findByEmail, 
    findById, 
    update
 };