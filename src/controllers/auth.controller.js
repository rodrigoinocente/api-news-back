import bcrypt from "bcrypt";
import authService from "../services/auth.service.js";


const loginService = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authService.loginService(email);

        if (!user) {
            return res.status(400).send({ message: "Email or Password not found" });

        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(404).send({ message: "Email or Password not found" });
        }

        res.send("Login ok");
    } catch (err) { res.status(500).send(err.message); }
};

export default { loginService };