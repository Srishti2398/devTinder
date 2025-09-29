const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation")
const bcrypt = require("bcrypt");

authRouter.post("/signup",async(req,res) => {

    try{
      //Validation of Data
      validateSignUpData(req);
      //Encrypt the password
      const { firstName,lastName,emailId,password,about,skills} = req.body;

      const passwordHash = await bcrypt.hash(password,10);
      console.log('Incoming signup data:', req.body);
      //console.log(passwordHash);

      //Creating New Instance of user model
      //const user = new User (req.body);
      const user = new User ({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
        about,
        skills,
      });
      const savedUser =  await user.save();
      const token = await savedUser.getJWT();
        res.cookie("token",token,
          {expires: new Date(Date.now()+8 *3600000),

        });
        //res.send(user);
    // Creating a new instance of the user model
      res.json({message:"User Added successfully", data: savedUser});
    }catch(err) {
      res.status(400).send("ERROR:" + err.message);
    }
});

authRouter.post("/login",async(req,res) => {
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
        res.send(user);
       }
  }
  catch(err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post("/logout",async(req,res) => {

  res.cookie("token",null,{
    expires: new Date(Date.now()),
  });
  res.send("Logout successful!!");
});

module.exports = authRouter;