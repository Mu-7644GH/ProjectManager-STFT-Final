const bcrypt = require("bcrypt");
const { UserModel, validateLogin, genToken} = require("../models/userModel");

exports.handleUserLogin = async (req, res) => {
    let validatedBody = validateLogin(req.body);
    if (validatedBody.error) {
        return res.status(400).json({ msg: validatedBody.error.details });
    }

    let userData = await UserModel.findOne({ email: req.body.email });

    if (!userData) {
        return res.json({ status: false, message: "Error, this Email is invalid!" });
    }

    let password = await bcrypt.compare(req.body.password, userData.password);
    if (!password) {
        return res.json({ status: false, message: "Error, Wrong password, try again!" });
    }

    let newToken = genToken(userData._id);
    console.log("USER ID:" + userData._id);
    return res.json({ status: true, token: newToken, username: userData.username , shortId: userData.shortId });
}

// export default loginController;