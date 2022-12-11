const express = require("express");
const router = express.Router();

//controllers
const {handleUserLogin} = require('../controllers/loginController');
const {handleUserCreation} = require('../controllers/usersController');
const {handleCommunity} = require('../controllers/projectsController');

router.get("/", (req,res) =>{
      res.send('Hello from INDEX route!');
})

router.post("/login", handleUserLogin);

router.post("/signup", handleUserCreation);
router.get("/community", handleCommunity);

module.exports = router;