const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const cors = require('cors');

app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true,
  })

);

app.use(express.json());
app.use(cookieParser());


app.use(express.json());
//app.use(cors());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



connectDB()
  .then(() => {
    console.log("database connection is established");
    app.listen(7777, () => {
        console.log("server has started successfully on port 7777");
    });

  }

  )
  .catch((err) => {
    console.error("Database cannot be connected");
  });

