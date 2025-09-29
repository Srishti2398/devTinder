const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email Address" +value)
            }
        },
    },
    password:{
        type:String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password" +value)
            }
        },
    },
    age:{
        type:Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male","female","others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMjEP3_R1Hl5zMA6_azjQmepOrbVtd--sJZw&s'
    },
    about: {
        type: String,
        default:'This is default about'
    },
    skills: {
        type: [String],
    }
   },
   {
    timestamps: true,
  }
);

//userSchema.find({firstName:"Elon",lastName:"Musk"});

userSchema.index({firstName:1, lastName:1});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({_id:user._id},"DEV@Tinder$375 ",{
             expiresIn:"1d",
          });
  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);

    return isPasswordValid;
  };


module.exports = mongoose.model("User",userSchema);
