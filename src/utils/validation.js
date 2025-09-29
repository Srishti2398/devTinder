const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || ! lastName) {
        throw new Error("Name is not Valid");
    }
    else if (!validator.isEmail(emailId)) {  // Fix: add `!` to check for *invalid* emails
        throw new Error("Email is not Valid!");
    }
    else if (!validator.isStrongPassword(password)) {  // Fix: add `!` to check for *weak* password
        throw new Error("Please Enter a valid Password!");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName","lastName","emailId","photoUrl","gender","age","about","skills"];
    // Check if all fields are allowed
   const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
};
