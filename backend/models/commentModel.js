const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { array, string } = require("joi");


let commentSchema = new mongoose.Schema({
    // _id:
    username:String,
    timestamp:{type:Date, default: Date.now()},
    text:String,
    attachments: [String],
})

exports.commentModel = mongoose.model("chats",commentSchema);

exports.validateNewComment = (_newCommentToValidate) =>{
    let joiCommentSchema = Joi.object({
        // title:Joi.string().min(5).max(30).required(),
        text:Joi.string().min(1).max(50).required(),
    })
    return joiCommentSchema.validate(_newCommentToValidate);
}