import { Types } from "mongoose";
import { IUser } from "../../custom";
import { UserModel } from "../database/db";

const createRepositories = (body: IUser): Promise<IUser> => UserModel.create(body);

const findAllUserRepositories = (): Promise<IUser[]> => UserModel.find();

const findByEmailRepositories = (email: string): Promise<IUser | null> => UserModel.findOne({ email: email });

const findByIdRepositories = (userId: Types.ObjectId): Promise<IUser | null> => UserModel.findById(userId);

const updateRepositories = (userId:  Types.ObjectId, body: IUser): Promise<IUser | null> => UserModel.findOneAndUpdate(
    { _id: userId },
    {...body }, { new: true }
);

export default {
    createRepositories,
    findAllUserRepositories,
    findByEmailRepositories,
    findByIdRepositories,
    updateRepositories
};