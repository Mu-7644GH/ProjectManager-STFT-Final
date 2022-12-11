const express = require("express");
const router = express.Router();

const {handleUserCreation, handleUserRoles_get} = require('../controllers/usersController');
const {tokenAuth} = require('../middleware/tokenAuthentication')

// router.get("/projects-lists",tokenAuth, handleUserRoles_get);
router.post("/add", tokenAuth, handleUserCreation);
router.get("/get_roles/:shortId",tokenAuth, handleUserRoles_get);

module.exports = router;