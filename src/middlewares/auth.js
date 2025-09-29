

 const User = require("../models/user");
 const jwt = require("jsonwebtoken");

const userAuth = async(req,res,next) => {
    //Read the token from req cookies
try{
    const { token }= req.cookies;
    if(!token) {
        //throw new Error("Token is not valid");
        return res.status(401).send("Please login!!");
    }

    const decodeObj = await jwt.verify(token,"DEV@Tinder$375 ")

    const {_id} = decodeObj;

    const user = await User.findById(_id);

    if(!user) {
        throw new Error("User Not found");
    }
    req.user = user;
    next();
  }
    catch(err) {
        res.status(400).send("ERROR:" + err.message);
    }
    //Validate the token()
    //Find the user
};

module.exports = {
    userAuth,
};