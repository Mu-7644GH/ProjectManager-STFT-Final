const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");


let listSchema = new mongoose.Schema({
    name:String,
    // description:String,
    // tags:[String],
    // users:[String],
    // isPublic:{type:boolean, default:false},
    // attachments:[String],
    // category:String,
    // deadline:{type:Date, default: new Date().toDateString()},
})

exports.ListtModel = mongoose.model("lists",listSchema);

exports.validateNewList = (_newListToValidate) =>{
    let joiListSchema = Joi.object({
        title:Joi.string().min(5).max(40).required(),
        // description:Joi.string().min(5).max(99).required(),
        // username:Joi.string().min(2).max(99).required(),
        // email:Joi.string().min(6).max(200).required().email(),
        // password:Joi.string().min(6).max(15).required(),
        // projects:Joi.array(),
        // role:Joi.string().min(2).max(10).valid("USER","ADMIN").insensitive().required(),
    })
    return joiListSchema.validate(_newListToValidate);
}