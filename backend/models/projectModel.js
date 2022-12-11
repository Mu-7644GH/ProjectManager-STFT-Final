const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { string } = require("joi");


let projectSchema = new mongoose.Schema({
    // _id:
    shortId: String,
    name: String,
    description: String,
    lists: [ 
        {shortID: String, title: String, isLocked: Boolean, tasks: [String]}, 
    ],
    // order: [String],
    ownerUsername: String,
    ownerShortId: String,
    isPublic: { type: Boolean, default: false },
    members: {admins :[String], users: [String]} ,
    tags: [String],
    attachments: [String],
    category: {type: String, default: ""},
    activity: [String],
    bg: {type:String, default: "https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?cs=srgb&dl=pexels-abdullah-ghatasheh-1631677.jpg&fm=jpg"},
    themeColor: {type: String, default: "primary"},
    dateCreated: {type:Number, default: new Date().getTime()},
    chat: [String],
    modifiedAt: {type:Number, default: new Date().getTime()},
    activity:[String],
})

exports.ProjectModel = mongoose.model("projects", projectSchema);

exports.validateNewProject = (_newProjectToValidate) => {
    let joiProjectSchema = Joi.object({
        shortId: Joi.string().required(),
        name: Joi.string().min(4).max(99).required(),
        description: Joi.string().min(5).max(150).required(),
        ownerUsername: Joi.string().min(4).max(40).required(),
        ownerShortId: Joi.string().min(4).max(200).required(),
    })
    return joiProjectSchema.validate(_newProjectToValidate);
}

exports.validateProjectEdit = (_projectEditToValidate) => {
    let joiProjectSchema = Joi.object({
        name: Joi.string().min(4).max(99).required(),
        description: Joi.string().min(5).max(150).required(),
    })
}