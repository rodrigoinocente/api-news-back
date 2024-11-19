import jwt from "jsonwebtoken";

const generateToken = (email: string): string => jwt.sign({ email }, process.env.SECRET_JWT as any, { expiresIn: 86400 });

export default {
    generateToken
};