const create = (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name | !username | !email | !password) {
        res.status(400).send({ message: "Submit all fields for registration" });
    }

    res.status(201).send({
        message: "User created successfully",
        user: {
            name,
            username,
            email
        }
    });
}

module.exports = { create };