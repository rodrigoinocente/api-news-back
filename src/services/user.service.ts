import { IUser } from "../../custom";
import { UserModel } from "../database/db";

const createService = (body: any): Promise<IUser> => UserModel.create(body);

const findAllUserService = (): Promise<IUser[]> => UserModel.find();

const findByEmailService = (email: string): Promise<IUser | null> => UserModel.findOne({ email: email });

const findByIdService = (userId: string): Promise<IUser | null> => UserModel.findById(userId);

const updateService = (userId: string,
    name: string,
    username: string,
    email: string,
    password: string): Promise<IUser | null> => UserModel.findOneAndUpdate(
        { _id: userId },
        { name, username, email, password }
    );

export default {
    createService,
    findAllUserService,
    findByEmailService,
    findByIdService,
    updateService
};