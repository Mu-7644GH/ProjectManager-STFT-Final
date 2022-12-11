const express = require("express");
const router = express.Router();

const { tokenAuth } = require("../middleware/tokenAuthentication");
const { isProjectPublic } = require("../middleware/isProjectPublic");
const {handleNewTaskCreation, handleTaskDeletion, handleTasksList, handleTaskEdit, handleTaskInfo, handleGetAllTasks, handleTasksReorder} = require('../controllers/tasksController')

router.get("/getonelist/:shortId/:listId",isProjectPublic, tokenAuth, handleTasksList);
router.get("/getall/:projectID/", handleGetAllTasks);
// router.post("/reorder/:shortid", tokenAuth, handleTasksReorder)
router.put("/:taskid", tokenAuth, handleTaskEdit)
router.delete("/del/:projectID/:listID/:taskID", handleTaskDeletion);
router.get("/getone/:projectID/:listID/:taskID", handleTaskInfo);
router.post("/add/:projectID/:listID", handleNewTaskCreation);
// router.delete("/del/:projectID/:listID/:taskID", handleTaskDeletion);


module.exports = router;