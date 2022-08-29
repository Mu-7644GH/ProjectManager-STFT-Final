const express = require("express");
const router = express.Router();

const { tokenAuth } = require("../middleware/tokenAuthentication");
const {handleNewTaskCreation, handleTaskDeletion, handleTasksList, handleTaskInfo, handleGetAllTasks, handleTasksReorder} = require('../controllers/tasksController')

router.get("/getall/:projectID/:listID", handleTasksList);
router.get("/getall/:projectID/", handleGetAllTasks);
router.post("/reorder/:shortid", tokenAuth, handleTasksReorder)
router.delete("/del/:projectID/:listID/:taskID", handleTaskDeletion);
router.get("/getone/:projectID/:listID/:taskID", handleTaskInfo);
router.post("/add/:projectID/:listID", handleNewTaskCreation);
router.delete("/del/:projectID/:listID", handleTaskDeletion);


module.exports = router;