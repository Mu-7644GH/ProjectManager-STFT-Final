const { UserModel } = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const { ProjectModel } = require("../models/projectModel");


exports.isMemberCheck = async (req, res, next) => { 
    let projectData =  ProjectModel.findOne({shortID: req.params.shortid });
    let userData = UserModel.findOne({_id: mongoose.Types.ObjectId(req.tokenData._id)})
    let userShortID = userData.shortID;

    req.isMember = projectData.members.admins.includes(userShortID)  ? admin : false ;
    req.isMember = projectData.members.admins.includes(userShortID)  ? user : false ;
    next();
}