import bcrypt from "bcrypt";
import authService from "../services/auth.service";
import { Request, Response } from "express"
import { IUser } from "../../custom";

const loginService = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user: IUser | null = await authService.loginService(email);
        if (!user) return res.status(400).send({ message: "Email or Password not found" });

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) return res.status(404).send({ message: "Email or Password not found" });

        const token = authService.generateToken(user._id);

        res.status(200).send({ token });

    } catch (err: any) {
        res.status(401).send(err.message);
    };
};

export default { loginService };