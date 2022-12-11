const jwt = require("jsonwebtoken");

exports.tokenAuth = async (req, res, next) => {
    // console.log("recvied token:" + req.header("authtoken"))

    if (res.locals?.isTokenNeeded == false) {
        next();
    } else {
        console.log("token authentication proccess:");
        let userToken = req.header("authtoken");
        console.log(userToken);
        
        if (userToken) {
            console.log("   -token found:");
        } else {
            console.log("   -Erorr: token not found!");
            return res.json({ status: false, msg: "Error: token not found!" });
        }

        try {
            console.log("   -token beign verified...");
            let decodeToken = jwt.verify(userToken, "SECRETKEY");
            console.log("   -token valid!");
            req.tokenData = decodeToken;
            next();
        } catch (error) {
            return res.json({ status: false, msg: error, });
            // next();

        }
    }




}