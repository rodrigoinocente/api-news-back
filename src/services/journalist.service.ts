import journalistRepositories from "../repositories/journalist.repositories";
import { IJournalist } from "../../custom";
// import authRepositories from "../repositories/auth.repositories";
// import bcrypt from "bcrypt";
// import { Types } from "mongoose";

const createJournalistService = async (body: IJournalist): Promise<void> => {
    const { name, bio, profilePicture, email } = body;
    if (!name || !bio || !profilePicture || !email)
        throw new Error("Submit all fields for registration");

    const isEmailInUse = await journalistRepositories.findByEmailRepositories(email);
    if (isEmailInUse) throw new Error("The provided email is already in use");

    const createdUser: IJournalist = await journalistRepositories.createJournalistRepositories(body);
    if (!createdUser) throw new Error("Error creating Journalist")
};

// const findAllUserService = async (): Promise<IUser[]> => {
//     const users: IUser[] = await userRepositories.findAllUserRepositories();
//     if (users.length === 0) throw new Error("There are no registered users");

//     return users;
// };

// const findByEmailService = async (email: string): Promise<IUser | null> => {
//     const user: IUser | null = await userRepositories.findByEmailRepositories(email);
//     if (!user) throw new Error("User not found by email");

//     return user;
// };

// const findByIdService = async (userId: Types.ObjectId): Promise<IUser | null> => {
//     const user = await userRepositories.findByIdRepositories(userId)
//     if (!user) throw new Error("User not found by ID");

//     return user
// };

// const updateService = async (userToFoundId: Types.ObjectId, userLoggedId: Types.ObjectId, body: IUser): Promise<Omit<IUser, "password"> | null> => {
//     let { name, username, email, password } = body;
//     if (!name && !username && !email && !password) throw new Error("Submit at least one fields for update")

//     if (userToFoundId.toString() !== userLoggedId.toString()) throw new Error("You didn't update this user");

//     if (email) {
//         const isEmailInUse = await userRepositories.findByEmailRepositories(email);
//         if (isEmailInUse) throw new Error("The provided email is already in use");
//     }

//     await findByIdService(userToFoundId);

//     if (password) body.password = await bcrypt.hash(password, 10)

//     const userUpdate = await userRepositories.updateRepositories(userLoggedId, body);
//     if (!userUpdate) throw new Error("Error updating");

//     return userUpdate
// };

export default {
    createJournalistService,
    //     findAllUserService,
    //     findByEmailService,
    //     findByIdService,
    //     updateService
};