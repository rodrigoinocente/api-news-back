// import { Types } from "mongoose";
import { IJournalist } from "../../custom";
import { JournalistModel } from "../database/db";

const createJournalistRepositories = (body: IJournalist): Promise<IJournalist> => JournalistModel.create(body);

const findAllJournalistRepositories = (): Promise<IJournalist[]> => JournalistModel.find();

const findByEmailRepositories = (email: string): Promise<IJournalist | null> => JournalistModel.findOne({ email: email });

// const findByIdRepositories = (userId: Types.ObjectId): Promise<IUser | null> => UserModel.findById(userId);

// const updateRepositories = (userId:  Types.ObjectId, body: IUser): Promise<IUser | null> => UserModel.findOneAndUpdate(
//     { _id: userId },
//     {...body }, { new: true }
// );

export default {
    createJournalistRepositories,
    findAllJournalistRepositories,
    findByEmailRepositories,
//     findByIdRepositories,
//     updateRepositories
};