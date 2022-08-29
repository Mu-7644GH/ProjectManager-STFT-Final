const express = require("express");
const router = express.Router();

const { tokenAuth } = require("../middleware/tokenAuthentication");

//controllers
const {handleProjectsList, handleListReorder, handleNewProjectCreation, handleProjectDeletion, handleLists_get, handleNewListCreation, handleListDeletion, handleProjectData} = require('../controllers/projectsController')


router.get("/getall", tokenAuth, handleProjectsList);
router.get("/getone/:shortid", tokenAuth, handleProjectData);
router.post("/add", tokenAuth, handleNewProjectCreation);
router.delete("/del/:shortid", tokenAuth, handleProjectDeletion);
router.get("/lists/getall/:shortid", tokenAuth, handleLists_get);
router.post("/lists/add/:shortid", tokenAuth, handleNewListCreation);
router.post("/lists/reorder/:shortid", tokenAuth, handleListReorder);
router.delete("/:shortid/lists/del/:listid", tokenAuth, handleListDeletion);


module.exports = router;