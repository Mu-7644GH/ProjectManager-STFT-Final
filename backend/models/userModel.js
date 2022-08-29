const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// const d = new Date();

let userSchema = new mongoose.Schema({
    // _id: String,
    shortID: String,
    username:String,
    name: String, 
    profilePic: String,
    bio:String,
    email:String,
    password:{type:String, default:"123123"},
    projects:{owner: [String], member: [String]},
    notifications: [String],
    dateCreated:{type:Number, default: new Date().getTime()},
    
    // activity: [String],
    // date:{type:String, default: Date.now()},
    // role:{type:String, default:"USER"}
})

exports.UserModel = mongoose.model("users",userSchema);

exports.validateUser = (_userToValidate) =>{
    let joiUserSchema = Joi.object({
        shortID: Joi.string().min(5).max(12).required(),
        username: Joi.string().min(5).max(20).required(),
        email: Joi.string().min(6).max(99).required().email(),
        password: Joi.string().min(6).max(15).required(),
    })
    return joiUserSchema.validate(_userToValidate);
}

exports.validateLogin = (_loginToValidate) =>{
    let joiUserSchema = Joi.object({
        email:Joi.string().min(6).max(200).required().email(),
        password:Joi.string().min(6).max(15).required(),
    })
    return joiUserSchema.validate(_loginToValidate);
}

exports.genToken = (_userID) => {
    let token = jwt.sign({_id:_userID}, process.env.TOKEN_SECRETKEY ,{expiresIn:"15days"});
    return token;
}