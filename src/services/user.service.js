import { UserModel } from "../database/db.js";

const createService = (body) => UserModel.create(body);

const findAllUserService = () => UserModel.find();

const findByEmailService = (email) => UserModel.findOne({ email: email });

const findByIdService = (userId) => UserModel.findById(userId);

const updateService = (userId,
    name,
    username,
    email,
    password) => UserModel.findOneAndUpdate(
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