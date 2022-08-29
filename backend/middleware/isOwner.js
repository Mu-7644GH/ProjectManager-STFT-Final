const { UserModel } = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const { ProjectModel } = require("../models/projectModel");


exports.isOwnerCheck = async (req, res, next) => { 
    let projectData =  ProjectModel.findOne({shortID: req.params.shortid });
    let userData = UserModel.findOne({_id: mongoose.Types.ObjectId(req.tokenData._id)})
    let userShortID = userData.shortID;

    req.isOwner = projectData.ownerShortID === userShortID ? true : false ;
    next();
}