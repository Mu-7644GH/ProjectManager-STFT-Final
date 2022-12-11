const { TaskModel, validateNewTask } = require('../models/taskModel');
const { ProjectModel } = require('../models/projectModel');
const mongoose = require('mongoose')

exports.handleNewTaskCreation = async (req, res) => {
    // req.body
    // TaskModel.updateOne
    // .findOne({'lists._id': req.params.listID});
    // try {
    //     validateNewTask(req.body);
    // } catch (error) {

    // }
    let val = validateNewTask(req.body);
    if (val.error) {
        console.log(val.error.details)
    }

    let task = await TaskModel.create({ ...req.body })
    // let list = await ProjectModel.findOne({shortid: req.params.projectID}, {lists: {$elemMatch: {'_id': mongoose.Types.ObjectId(req.params.listID) }} },  { $push: { "tasks": task._id } });
    let list = await ProjectModel.updateOne({ shortid: req.params.projectID, 'lists': { $elemMatch: { '_id': mongoose.Types.ObjectId(req.params.listID) } } }, { $push: { 'lists.$.tasks': task._id } });
    /// list.
    // list.tasks.push(task._id)

    return res.json({ status: true, data: task, list: list });

}

exports.handleTaskDeletion = async (req, res) => {
    try {
        await TaskModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.taskID) })
    } catch (error) {
        console.log(error);
        return res.json({ status: -1, msg: "Task deletion went wrong!", sev: "error", data: error });
    }

    try {
        let projectData = await ProjectModel.findOne({ shortId: req.params.projectID });

        // let index = -1;
        let Lindex = projectData.lists.findIndex(l => l.id === req.params.listID);
        // console.log("LIST INDEX: " + Lindex);
        // console.log("LIST id: " + projectData?.lists[Lindex]?.id);
        let Tindex = projectData?.lists[Lindex]?.tasks.findIndex(t => t === req.params.taskID);
        // console.log("TASK INDEX: " + Tindex);

        // for (let i = 0, len = projectData.lists.length; i < len; i++) {
        // if (projectData.lists[i]._id == req.params.listID) {
        // index = i;
        // break;
        // }
        // console.log(projectData.lists[i]._id);
        // }
        // console.log({index_num: index});

        // index = projectData.lists.findIndex((l) => { 
        //     l._id == req.params.listID;
        // });


        let nl = projectData.lists[Lindex].tasks;
        nl.splice(Tindex, 1);

        projectData.lists[Lindex].tasks = nl;
        projectData.save();
    } catch (error) {
        console.log("erorr list project update!!!!,,,,");
        console.log(error);
        return res.json({ status: -1, msg: error, sev: "error", err: error });
    }


}

exports.handleTasksList = async (req, res) => {
    // let project = await ProjectModel.findOne({shortid: req.params.projectID, 'lists': {$elemMatch: {'_id': mongoose.Types.ObjectId(req.params.listID) }}});
    console.log("///////////////handleTasksList")
    try {

        let project = await ProjectModel.findOne({ shortId: req.params.shortId })
        // let lists = project.lists;
        // let list = lists?.find(item => item._id === req.params.listID);
        let list = project.lists?.find(item => item._id == req.params.listId);

        let tasksArr = [];

        for (const t of list?.tasks) {
            let itm = await TaskModel.findOne({ _id: mongoose.Types.ObjectId(t) });
            // console.log(itm);
            console.log("////tasks");
            tasksArr.push(itm)
        }
        console.log(tasksArr)


        return res.json({ status: true, msg: "htlllll", data: tasksArr });
    } catch (error) {
        console.log(error);
        return res.json(error)
    }
    // console.log(tasksArr);
}

exports.handleTaskInfo = async (req, res) => {
    // req.params.taskID
    let itm = await TaskModel.findOne({ _id: mongoose.Types.ObjectId(req.params.taskID) });
    return res.json({ status: true, data: itm });
}

exports.handleGetAllTasks = async (req, res) => {
    let project = await ProjectModel.findOne({ shortid: req.params.projectID });
    let lists = project.lists;

    let allTasksObj = {}
    lists.forEach(l => {
        let listTasks = [];
        l.tasks.forEach(t => {
            let tsk = TaskModel.findOne({ _id: mongoose.Types.ObjectId(t) });
            listTasks.push(tsk)
        });
        allTasksObj[l._id] = listTasks;
    });

    return res.json({ status: true, data: allTasksObj });
}

// exports.handleTasksReorder = async (req, res) => {

//     try {

//         await ProjectModel.updateOne({ shortId: req.params.shortid, "lists._id": req.body.listId }, { $set: { "lists.$.tasks": req.body.tasks } });
//         // let project = await ProjectModel.findOne({ shortId: req.params.shortid});
//         // project.lists[req.body.index].tasks =  req.body.tasks;
//         // project.save();
//         // project.save();
//         console.log("task reorder end...")
//         return res.json({status: 1, msg: "success"});
//     } catch (error) {
//         console.log(error);
//         return res.json({status: 1, msg: "success", err: error});
//     }

// }

exports.handleTaskEdit = async (req,res) => {
    try {
        let task = await TaskModel.findById(req.params.taskid);

        if (req.body.prp === "title") {
            task.title = req.body.val;
        }
        if (req.body.prp === "desc") {
            task.description = req.body.val;
        }
        if (req.body.prp === "hold") {
            task.isOnHold = req.body.val;
        }
        if (req.body.prp === "done") {
            task.isDone = req.body.val;
        }

        task.save();
        return res.json({ status: 1, msg: "task updated successfully", sev: "success" })
    } catch (error) {
        return res.json({ status: -1, msg: "error", err: error, sev: "error" })

    }
}