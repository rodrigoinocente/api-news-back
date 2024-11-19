import authRepositories from "../repositories/auth.repositories";
import bcrypt from "bcrypt";

const loginService = async (email: string, password: string) => {
  const emailAdmin = process.env.EMAIL_ADMIN
  const passwordAdmin = process.env.PASSWORD_ADMIN

  if (email !== emailAdmin) throw new Error("Email or Password not found");

  const isPasswordValid = await bcrypt.compare(password, passwordAdmin as string);
  if (!isPasswordValid) throw new Error("Email or Password not found");

  const token = authRepositories.generateToken(email);

  return token;
};

export default { loginService };