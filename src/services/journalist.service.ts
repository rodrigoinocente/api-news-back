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

const updateJournalistService = async (journalistId: Types.ObjectId, body: IJournalist): Promise<void> => {
    let { name, bio, profilePicture, email } = body;
    if (!name && !bio && !profilePicture && !email) throw new Error("Submit at least one fields for update")

    if (email) {
        const isEmailInUse = await journalistRepositories.findByEmailRepositories(email);
        if (isEmailInUse) throw new Error("The provided email is already in use");
    }

    const userUpdate = await journalistRepositories.updateJournalistRepositories(journalistId, body);
    if (!userUpdate) throw new Error("Error updating");
};

export default {
    createJournalistService,
    findAllJournalistService,
    findJournalistByIdService,
    updateJournalistService
};