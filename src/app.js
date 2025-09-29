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

/*app.post("/signup",async(req,res) => {

    try{
      //Validation of Data
      validateSignUpData(req);
      //Encrypt the password
      const { firstName,lastName,emailId,password} = req.body;
      const passwordHash = await bcrypt.hash(password,10);
      console.log(passwordHash);

      //Creating New Instance of user model
      //const user = new User (req.body);
      const user = new User ({
        firstName,
        lastName,
        emailId,
        password:passwordHash,

      });
      await user.save();
    // Creating a new instance of the user model
      res.send("User Added successfully");
    }catch(err) {
      res.status(400).send("ERROR:" + err.message);
    }
});*/

/*app.post("/login",async(req,res) => {
  try {
    const { emailId, password} = req.body;
    const user = await User.findOne({ emailId:emailId });
    if(!user) {
       throw new Error("Invalid Credentials");
    }
    //const isPasswordValid = await bcrypt.compare(password,user.password);
    const isPasswordValid = await user.validatePassword(password);


     //Create JWT token
     //Set cookie
       if (isPasswordValid) {


       const token = await user.getJWT();
        //console.log(token);
        res.cookie("token",token,{expires: new Date(Date.now()+8 *3600000),

        });
        res.send("Login Successful!!");
       }
  }
  catch(err) {
    res.status(400).send("ERROR:" + err.message);
  }
});*/

/*app.get("/profile",userAuth, async (req, res) => {
  const cookies = req.cookies;

  const {token} = cookies;
  //Validate my token

  const decodedMessage = await jwt.verify(token,"DEV@Tinder$375 ")

  const { _id } = decodedMessage;

  console.log("Logged in User is:" + _id);

  console.log(cookies);
  res.send("Reading cookie");
});*/

//Get User by Id.
/*app.get("/user", async (req, res) => {
  const userEmail = req.query.emailId;
  console.log("Received emailId from query:", userEmail);

  try {
    if (!userEmail) {
      return res.status(400).send("Email ID is missing in query");
    }

    const user = await User.find({ emailId: userEmail });

    console.log("MongoDB query result:", user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    console.error("Error in /user route:", err);  // THIS will catch and print any real errors
    res.status(400).send("Something went wrong");
  }
});*/

/*app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest",userAuth,async(req,res)=> {
  const user = req.user;

  //Sending a connection request
  console.log("Sending a connection request");
  res.send(user.firstName+ "sent the connection request!");
})

//Get all the Users
app.get("/feed",async(req,res)=>{
  try{
    const users = await User.find({});
    res.send(users);

  }
  catch(err){
    res.status(400).send("something went wrong");
  }

});

app.delete("/user",async(req,res)=> {
  const userId = req.body.userId;
  try {
      const user = await User.findByIdAndDelete({_id:userId });
      res.send("User Deleted successfully");
  }
  catch(err) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user",async(req,res)=> {
  const userId =req.body.userId;
  const data = req.body;

  const ALLOWED_UPDATES = [
    "userId","photourl","about","gender","age"
  ];

  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );
  if(!isUpdateAllowed) {
     res.status(400).send("Update not allowed")
  }
  try {
       await User.findByIdAndUpdate({_id:userId },data);
      res.send("User Updated successfully");
  }
  catch(err) {
    res.status(400).send("something went wrong");
  }
});*/


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

