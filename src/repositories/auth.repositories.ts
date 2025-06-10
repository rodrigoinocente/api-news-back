import jwt from "jsonwebtoken";

const generateToken = (email: string): string => jwt.sign({ email }, process.env.BACK_SECRET_JWT as any, { expiresIn: 86400 });

export default {
    generateToken
};