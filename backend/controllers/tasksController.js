const { TaskModel, validateNewTask  } = require ('../models/taskModel');
const { ProjectModel  } = require ('../models/projectModel');
const mongoose = require ('mongoose')

exports.handleNewTaskCreation = async(req, res) => {
    // req.body
    // TaskModel.updateOne
    // .findOne({'lists._id': req.params.listID});
    // try {
    //     validateNewTask(req.body);
    // } catch (error) {
        
    // }

    let val = validateNewTask(req.body);
    if(val.error){
        console.log(val.error.details)
    }

    let task = await TaskModel.create({...req.body})
    // let list = await ProjectModel.findOne({shortid: req.params.projectID}, {lists: {$elemMatch: {'_id': mongoose.Types.ObjectId(req.params.listID) }} },  { $push: { "tasks": task._id } });
    let list = await ProjectModel.updateOne({shortid: req.params.projectID, 'lists': {$elemMatch: {'_id': mongoose.Types.ObjectId(req.params.listID) }}}, { $push: { 'lists.$.tasks': task._id } });
    /// list.
    // list.tasks.push(task._id)
    
    return res.json({ status: true, data: task, list: list});
    
}

exports.handleTaskDeletion = async (req, res) => {
    try {
        await TaskModel.deleteOne({_id: mongoose.Types.ObjectId(req.params.taskID)})
    } catch (error) {
        console.log(error);
        return res.json({msg: "deletion went wrong!", data: error});
    }

    try {
        let projectData = await ProjectModel.findOne({shortID: req.params.projectID});

        let index = -1;
        for(let i = 0, len = projectData.lists.length; i < len; i++) {
            if (projectData.lists[i]._id == req.params.listID) {
                index = i;
                break;
            }
            // console.log(projectData.lists[i]._id);
        }
        console.log({index_num: index});

        // index = projectData.lists.findIndex((l) => { 
        //     l._id == req.params.listID;
        // });

        projectData.lists[index].tasks = projectData.lists[index].tasks.filter(t => {
            t._id != req.params.taskID;
        })
        projectData.save();
    } catch (error) {
        return res.json({msg: error});
    }


}

exports.handleTasksList = async(req, res) => {
    let project = await ProjectModel.findOne({shortid: req.params.projectID, 'lists': {$elemMatch: {'_id': mongoose.Types.ObjectId(req.params.listID) }}});
    let tasksArr = [];
    // let taskObj = tasks.lists.find( item => item._id == req.params.listID);
    let list = project.lists?.find( item => item._id == req.params.listID);

    for(const t of list.tasks){
        let itm =  await TaskModel.findOne({_id: mongoose.Types.ObjectId(t)});
        // console.log(itm);
        tasksArr.push(itm)
        // console.log()
    }


    console.log(tasksArr);
    return res.json({ status: true, data: tasksArr});
}

exports.handleTaskInfo = async(req, res) => {
    // req.params.taskID
    let itm =  await TaskModel.findOne({_id: mongoose.Types.ObjectId(req.params.taskID)});
    return res.json({ status: true, data: itm});
    
}

exports.handleGetAllTasks = async(req, res) => {
    let project = await ProjectModel.findOne({shortid: req.params.projectID});
    let lists = project.lists;
    
    let allTasksObj = {}
    lists.forEach(l => {
        let listTasks = [];
        l.tasks.forEach(t => {
            let tsk =  TaskModel.findOne({_id: mongoose.Types.ObjectId(t)});
            listTasks.push(tsk)
        });
        allTasksObj[l._id] = listTasks; 
    });

    return res.json({status: true, data: allTasksObj});
}

exports.handleTasksReorder = async(req, res) =>{

    try {

        let project = await ProjectModel.updateOne({ shortID: req.params.shortid, "lists._id": req.body.listID }, {$set: { "lists.$.tasks": req.body.tasks}});
        
    } catch (error) {
        console.log(error);
    }

}