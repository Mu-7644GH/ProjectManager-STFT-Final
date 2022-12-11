// const { default: mongoose } = require("mongoose");

// const { UserModel } = require("../models/userModel");
const { ProjectModel } = require("../models/projectModel");


exports.isProjectPublic = async (req, res, next) => { 
    let projectData =  await ProjectModel.findOne({shortId: req.params.shortId });

    if(projectData?.isPublic === true){
        console.log("token not needed!");
        res.locals.isTokenNeeded = false;
        next();
    }else{
        console.log("token is needed!");
        res.locals.isTokenNeeded = true;
        next();
    }


}