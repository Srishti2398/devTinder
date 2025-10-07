const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
     "mongodb+srv://srishti_2398:u5iWxrhG99bnYU8b@cluster0.rhenuza.mongodb.net/devTinder"
    );
};

connectDB()
  .then(() => {
    console.log("Database connection established...");
  })
  .catch(()=> {
    console.error("Database cannot be connected");
  });

  module.exports = connectDB;
