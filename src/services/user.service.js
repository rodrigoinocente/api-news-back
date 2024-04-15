import User from "../models/User.js"

const create = (body) => User.create(body);

const findAllUser = () => User.find();

const findByEmail = (email) => User.findOne().where("email").equals(email);

const findById = (id) => User.findById(id);

const update = (id,
    name,
    username,
    email,
    password) => User.findOneAndUpdate(
        { _id: id },
        { name, username, email, password }
    );

export default { create, 
    findAllUser, 
    findByEmail, 
    findById, 
    update 
};