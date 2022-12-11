const express = require("express");
const router = express.Router();

const { tokenAuth } = require("../middleware/tokenAuthentication");
const { isProjectPublic } = require("../middleware/isProjectPublic");

//controllers
const {handleUserProjectsLists, handleListReorder, handleNewProjectCreation, handleProjectDeletion, handleLists_get, handleNewListCreation, handleListDeletion, handleProjectData, handleGetProjectMembers, handleTasksOrderUpdate, handleSettingsUpdate, handleMembersAddition, handleMembersRemoval} = require('../controllers/projectsController')


// router.get("/get_data", tokenAuth, handleProjectData);
router.get("/user-projects-lists", tokenAuth, handleUserProjectsLists);
router.post("/", tokenAuth, handleNewProjectCreation);
router.delete("/:shortId", tokenAuth, handleProjectDeletion);
router.get("/:shortId",isProjectPublic, tokenAuth, handleProjectData);

router.post("/:shortId/lists", tokenAuth, handleNewListCreation);

router.get("/lists/getall/:shortId",isProjectPublic, tokenAuth, handleLists_get);

router.put("/:shortId/tasks-order", tokenAuth, handleTasksOrderUpdate);
router.put("/:shortId/lists-reorder/", tokenAuth, handleListReorder);

router.put("/:shortId/settings", tokenAuth, handleSettingsUpdate);

router.put("/:shortId/members", tokenAuth, handleMembersAddition);
router.delete("/:shortId/members", tokenAuth, handleMembersRemoval);

// router.get("/getall", tokenAuth, handleUserProjectsLists);
// router.post("/add", tokenAuth, handleNewProjectCreation);

router.get("/:shortid/members", tokenAuth, handleGetProjectMembers);
// router.get("/lists/getall/:shortid", isProjectPublic ,tokenAuth, handleLists_get);
// router.post("/lists/reorder/:shortid", tokenAuth, handleListReorder);
router.delete("/:shortId/lists/:listId", tokenAuth, handleListDeletion);


module.exports = router;