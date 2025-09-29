const express = require("express");
const profileRouter = express.Router();


const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation")


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      console.log(user);
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)){
       throw new Error("Invalid Edit request");
    };
    const loggedInuser = req.user;
    console.log( loggedInuser);
    loggedInuser.firstName = req.body.firstName;
    Object.keys(req.body).forEach((key) => loggedInuser[key] = req.body[key]);
    await loggedInuser.save();
    console.log( loggedInuser);
    //res.send(`${loggedInuser.firstName},Profile updated successfully`);
    res.json({
      message: `${loggedInuser.firstName},Profile updated successfully`,
      data: loggedInuser,
    });
    //res.send('Profile updated successfully');
  }
  catch(err) {
    res.status(400).send("ERROR:" + err.message);
  }
});



module.exports = profileRouter;