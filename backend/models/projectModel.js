const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { string } = require("joi");


let projectSchema = new mongoose.Schema({
    // _id:
    shortID: String,
    name: String,
    description: String,
    lists: [ 
        {shortID: String, title: String, isLocked: Boolean, tasks: [String]}, 
    ],
    order: [String],
    ownerUsername: String,
    ownerShortID: String,
    isPublic: { type: Boolean, default: false },
    members: {admins :[String], users: [String]} ,
    tags: [String],
    attachments: [String],
    category: String,
    activity: [String],
    bg: String,
    themeColoe: String,
    dateCreated: {type:Number, default: new Date().getTime()},
    chat: [String],
    modifiedAt: {type:Number, default: new Date().getTime()},
    activity:[String],
})

exports.ProjectModel = mongoose.model("projects", projectSchema);

exports.validateNewProject = (_newProjectToValidate) => {
    let joiProjectSchema = Joi.object({
        shortID: Joi.string().required(),
        name: Joi.string().min(4).max(99).required(),
        description: Joi.string().min(5).max(150).required(),
        ownerUN: Joi.string().min(4).max(40).required(),
        ownerShortID: Joi.string().min(4).max(200).required(),
    })
    return joiProjectSchema.validate(_newProjectToValidate);
}

exports.validateProjectEdit = (_projectEditToValidate) => {
    let joiProjectSchema = Joi.object({
        name: Joi.string().min(4).max(99).required(),
        description: Joi.string().min(5).max(150).required(),
    })
}