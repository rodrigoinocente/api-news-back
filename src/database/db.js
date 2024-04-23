import mongoose from "mongoose";

const connectDatabase = () => {
    console.log("Wait connecting to the Database");

    mongoose.connect(process.env.MONGOBD_URI)
        .then(() => console.log("MongoDB Atlas Connected"))
        .catch((error) => console.log(error))
};

export default connectDatabase;