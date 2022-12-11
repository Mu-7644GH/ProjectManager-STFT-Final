const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { array, string } = require("joi");


let taskSchema = new mongoose.Schema({
    title:String,
    description:{type:String, default: null},
    tags:[String],
    ownerUsername: {type:String, default: null},
    isOnHold:{type: Boolean, default:false},
    isDone:{type: Boolean, default:false},
    attachments:[String],
    dateCreated: {type:Number, default: new Date().getTime()},
    chat: [String],
    listId: String,
})

exports.TaskModel = mongoose.model("tasks",taskSchema);

exports.validateNewTask = (_newTaskToValidate) =>{
    let joiTaskSchema = Joi.object({
        title:Joi.string().min(1).max(30).required(),
        listId: Joi.string().min(1).max(150).required(),
    })
    return joiTaskSchema.validate(_newTaskToValidate);
}


exports.validateUpdatedTask = (_updatedTaskToValidate) =>{
    let joiTaskSchema = Joi.object({
        title:Joi.string().min(5).max(30),
        description:Joi.string().min(5).max(99),
        tags:Joi.array(),
        owners:Joi.array(),
        attachments:Joi.array(),
        deadline:Joi.date(),
        isChecked:Joi.boolean(),
        state:Joi.string().valid("TODO", "DOING", "DONE", "DONE").insensitive(),
        
    })
    return joiTaskSchema.validate(_updatedTaskToValidate);
}


