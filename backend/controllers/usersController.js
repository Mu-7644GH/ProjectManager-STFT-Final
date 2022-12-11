const bcrypt = require("bcrypt");
const { ProjectModel } = require("../models/projectModel");
const { UserModel, validateUser } = require("../models/userModel");

exports.handleUserCreation = async (req, res) => {

    let validatedBody = validateUser(req.body);
    // console.log(req.body)
    if (validatedBody.error) {
        return res.status(400).json({
            msg0: "validation error!!",
            msg: validatedBody.error.details
        });
    }

    try {
        let newUser = new UserModel(req.body);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();
        console.log("new user saved!");
        newUser.password = "*****";
        // return res.json({status: true, msg: "user created successfully", data: newUser});
        // next();
    } catch (error) {
        console.log(error);
        return res.json({ status: false, msg: "error!!", error });
    }

}

exports.handleUserRoles_get = async (req, res) => {
    // req.tokenData
    let user = await UserModel.findById(req.tokenData._id);
    let project = await ProjectModel.findOne({ shortId: req.params.shortId });

    let rolesObj = {};

    if (project.ownerShortId === user.shortId) {
        rolesObj.owner = true;
    } else {
        rolesObj.owner = false;
    }
    if (project.members.admins.includes(req.tokenData._id)) {
        rolesObj.admin = true;
    } else {
        rolesObj.admin = false;
    }
    if (project.members.users.includes(req.tokenData._id)) {
        rolesObj.user = true;
    } else {
        rolesObj.user = false;
    }

    return res.json({ status: 1, msg: "done Roles-Object", data: rolesObj });


}


