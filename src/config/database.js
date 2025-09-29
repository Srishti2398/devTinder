const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
     "**"
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
