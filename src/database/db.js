const mongoose = require("mongoose");

const connectDatabase = () => {
    console.log("Wait connecting to the Database");

    mongoose.connect("mongodb+srv://ridrigocorreia:analise1@cluster0.8pqqajl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        .then(() => console.log("MongoDB Atlas Connected"))
        .catch((error) => console.log(error))
}

module.exports = connectDatabase;