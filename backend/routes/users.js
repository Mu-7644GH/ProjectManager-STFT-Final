const express = require("express");
const router = express.Router();
const {handleUserCreation} = require('../controllers/usersController');

router.post("/add", handleUserCreation);

module.exports = router;