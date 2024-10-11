import userRepositories from "../repositories/user.repositories";
import { IUser } from "../../custom";
import authService from "./auth.service";
import bcrypt from "bcrypt";

const createUserService = async (body: IUser): Promise<{ user: Omit<IUser, "password">; token: string }> => {
    const { name, username, email, password } = body;

    if (!name || !username || !email || !password)
        throw new Error("Submit all fields for registration");

    const createdUser: IUser = await userRepositories.createRepositories(body);

    if(!createdUser)throw new Error("Error creating User")

    const token = authService.generateToken(createdUser._id)

    return {
        user: {
            _id: createdUser._id,
            name: createdUser.name,
            username: createdUser.username,
            email: createdUser.email
        },
        token
    };
};

const findAllUserService = async (): Promise<IUser[]> => {
    const users: IUser[] = await userRepositories.findAllUserRepositories();
    if (users.length === 0) throw new Error("There are no registered users");

    return users;
};

const findByEmailService = async (email: string): Promise<IUser | null> => {
    const user: IUser | null = await userRepositories.findByEmailRepositories(email);
    if (!user) throw new Error("User not found by email");

    return user;
};

const findByIdService = async (userId: string): Promise<IUser | null> => {
    const user = await userRepositories.findByIdRepositories(userId)
    if (!user) throw new Error("User not found by id");

    return user
};

const updateService = async (userToFoundId: string, userLoggedId: string, body: IUser): Promise<Omit<IUser, "password"> | null> => {

    let { name, username, email, password } = body;
    if (!name && !username && !email && !password)
        throw new Error("Submit at least one fields for update")

    if (userToFoundId !== String(userLoggedId))
        throw new Error("You didn't update this post");
    
    if (password) password = await bcrypt.hash(password, 10); /* TODO: Maybe middleware in User Schema */
    
    const userUpdate = await userRepositories.updateRepositories(userLoggedId, body);
    if (!userUpdate) throw new Error("Error updating");

    return userUpdate
};

export default {
    createUserService,
    findAllUserService,
    findByEmailService,
    findByIdService,
    updateService
};
