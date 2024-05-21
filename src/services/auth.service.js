import { UserModel } from "../database/db.js";
import jwt from "jsonwebtoken";

const loginService = (email) => UserModel.findOne({ email: email }).select("+password");

const generateToken = (id) => jwt.sign({ id: id }, process.env.SECRET_JWT, { expiresIn: 86400 });

export default {
    loginService,
    generateToken
};