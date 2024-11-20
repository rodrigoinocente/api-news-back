import journalistRepositories from "../repositories/journalist.repositories";
import { IJournalist } from "../../custom";
import { Types } from "mongoose";

const createJournalistService = async (body: IJournalist): Promise<void> => {
    const { name, bio, profilePicture, email } = body;
    if (!name || !bio || !profilePicture || !email)
        throw new Error("Submit all fields for registration");

    const isEmailInUse = await journalistRepositories.findByEmailRepositories(email);
    if (isEmailInUse) throw new Error("The provided email is already in use");

    const createdUser: IJournalist = await journalistRepositories.createJournalistRepositories(body);
    if (!createdUser) throw new Error("Error creating Journalist")
};

const findAllJournalistService = async (): Promise<IJournalist[]> => {
    const journalists: IJournalist[] = await journalistRepositories.findAllJournalistRepositories();
    if (journalists.length === 0) throw new Error("There are no registered journalist");

    return journalists;
};

const findJournalistByIdService = async (journalistId: Types.ObjectId): Promise<IJournalist | null> => {
    const journalist = await journalistRepositories.findJournalistByIdRepositories(journalistId)
    if (!journalist) throw new Error("Journalist not found by ID");

    return journalist;
};

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
    findAllJournalistService,
    findJournalistByIdService,
    //     updateService
};