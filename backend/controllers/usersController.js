const bcrypt = require("bcrypt");
const { UserModel, validateUser} = require("../models/userModel");

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
        return res.json({status: false, msg: "error!!", error});
    }

}

// exports./handleUserLogout = async

