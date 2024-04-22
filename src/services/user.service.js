import User from "../models/User.js"

const createService = (body) => User.create(body);

const findAllUserService = () => User.find();

const findByEmailService = (email) => User.findOne({email: email});

const findByIdService = (id) => User.findById(id);

const updateService = (id,
    name,
    username,
    email,
    password) => User.findOneAndUpdate(
        { _id: id },
        { name, username, email, password }
    );

export default { createService, 
    findAllUserService, 
    findByEmailService, 
    findByIdService, 
    updateService 
};