const { json } = require('express');
const { default: mongoose, Mongoose } = require('mongoose');
const { ProjectModel, validateNewProject } = require('../models/projectModel');
const { UserModel } = require('../models/userModel');


exports.handleUserProjectsLists = async (req, res) => {
    let userData = await UserModel.findOne({ _id: mongoose.Types.ObjectId(req.tokenData._id) });
    let ownerList = await ProjectModel.find({ ownerShortId: userData.shortId });

    memberProjectsIDList = [];
    memberList = [];
    memberProjectsIDList = userData.projects.member;

    for (const p of memberProjectsIDList) {
        const pobj = await ProjectModel.findById(p);
        memberList.push(pobj);

    }

    let projectsLists = { owner: ownerList, member: memberList }
    if (ownerList.length >= 1 || memberList.length >= 1) {

        return res.json({ status: true, data: ownerList, data2: memberList, data3: projectsLists, sev: "success" });
    }

    return res.json({ status: false, msg: "no projects found", sev: "error" });;
}

exports.handleNewProjectCreation = async (req, res) => {

    try {

        let validatedBody = validateNewProject(req.body);
        if (validatedBody.error) {
            // console.log(errordetails);
            return res.json({ status: false, msg: error, sev: "error" });
            // return res.status(400).json({
            //     msg0: "validation error!!",
            //     msg: validatedBody.error.details,
            // });
        }
        console.log("project validated");
    } catch (error) {
        return console.log(error)
    }


    try {

        // req.body.ownerUN = req.body.ownerUN;
        req.body.ownerId = req.tokenData._id;

        console.log("try adding new project");
        let newProject = new ProjectModel(req.body);
        await newProject.save();

        await UserModel.updateOne({ _id: req.tokenData._id }, { $push: { "projects.owner": newProject.id } })
        console.log("project id added to user!");
        console.log("new project added!");

        // console.log("new project object: ")
        return res.json({ status: true, data: newProject, msg: "Project created successfully!", sev: "success" });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, msg: error, sev: "error" });
    }
}

exports.handleProjectDeletion = async (req, res) => {
    console.log("-- Starting handleProjectDeletion...");
    let p = await ProjectModel.findOne({ shortId: req.params.shortId });
    let u = await UserModel.findById(req.tokenData._id)
    let mmbr = req.header("membership");

    console.log("p-id 0: " + req.params.shortId);
    try {

        let index = u.projects.owner.indexOf(i => i === p._id);
        u.projects.owner.splice(index);
        u.save();

        await ProjectModel.deleteOne({ shortId: req.params.shortId });
        // console.log("p-id: " + p._id);
        console.log("p-id: " + req.params.shortId);
        return res.json({ status: true, msg: "Project deleted successfully!", sev: "success" });
    } catch (error) {
        console.log(error)
        return res.json({ status: false, msg: "Project delete error!", sev: "error" });
    }

}


exports.handleProjectData = async (req, res) => {
    let projectData = await ProjectModel.findOne({ shortId: req.params.shortId });
    if (projectData) {
        // let opd = projectData.find(itm => itm.shortID === req.params.shortid)
        return res.json({ status: true, msg: "project data rerevied", sev: "success", data: projectData, tokenNeeded: res.locals?.isTokenNeeded });
    }

    // res.locals.isTokenNeeded

    return res.json({ status: false, msg: "projects not found", sev: "error", tokenNeeded: res.locals?.isTokenNeeded });;
}


/////////////////////////////////////////

exports.handleNewListCreation = async (req, res) => {
    // let reqNewListShortID = req.header("listNewShortID");

    try {
        await ProjectModel.updateOne({ shortId: req.params.shortId }, { $push: { "lists": req.body } })
        return res.json({ status: 1, msg: "New list created ", sev: "success" })
    } catch (error) {

        return res.json({ status: -1, msg: "error while creating new list", sev: "error", err: error });
    }
    // await ProjectModel.updateOne({ shortID: req.params.shortId }, { $push: { "order": req.body.shortID } })

}

exports.handleListDeletion = async (req, res) => {
    
    try {
        let project = await ProjectModel.findOne({ shortId: req.params.shortId });
        project.lists = project.lists.filter((item) => item._id != req.params.listId);
        project.save();
        return res.json({status: 1, msg: "list deleted succfully!", sev: "success" });
    } catch (error) {
        return res.json({status: -1, msg: "list deletion failed!", sev: "error", err: error });
    }
}

exports.handleTasksOrderUpdate = async (req, res) => {

    try {

        await ProjectModel.updateOne({ shortId: req.params.shortId, "lists._id": req.body.listId }, { $set: { "lists.$.tasks": req.body.tasks } });
        console.log("task reorder end...")
        return res.json({status: 1, msg: "successfuly updated tasks order.", sev: "success"});
    } catch (error) {
        console.log(error);
        return res.json({status: -1, msg: "Error, server error.", err: error, sev: "error"});
    }
    
}

exports.handleSettingsUpdate = async (req, res) => {
    try {
        await ProjectModel.updateOne({shortId: req.params.shortId},{$set: {[req.body.key]: req.body.value}})
        return res.json({status: 1, msg: "Successfully updated project settings!", sev: "success"});
    } catch (error) {
        console.log(error);
        return res.json({status: -1, msg: "Error while modifying the database", sev: "error", err: error});
        
    }
    // try {
    //     await ProjectModel.updateOne({shortId: req.params.shortId},{$set: {"name": req.body.name, "isPublic": req.body.isPublic, "tags": req.body.tags, "themeColor": req.body.themeColor, "bg": req.body.bg}})
    //     return res.Json({status: 1, msg: "Successfully updated project settings!", sev: "success"});
    // } catch (error) {
    //     console.log(error);
    //     return res.Json({status: -1, msg: "Error while modifying the database", sev: "error", err: error});
        
    // }
}


////////////////////////////////////////////////////////////////////

exports.handleLists_get = async (req, res) => {
    let project = await ProjectModel.findOne({ shortId: req.params.shortId });
    let lists = [];
    lists = project.lists;
    // console.log("/////LISTS:")
    // console.log(lists)
    if (lists.length >= 1) {
        return res.json({ status: true, msg: "succes list_get", data: lists });
    }
    
    return res.json({ status: true, msg: "no lists were found", data: lists });;
}

exports.handleListReorder = async (req, res) => {
    
    try {
        
        let project = await ProjectModel.updateOne({ shortId: req.params.shortId }, { $set: { "lists": req.body.data } });
        return res.json({status: 1, msg: "successfuly updated lists order.", sev: "success"});
    } catch (error) {
        console.log(error);
        return res.json({status: -1, msg: "Error, server error.", err: error, sev: "error"});
    }
}

exports.handleGetProjectMembers = async (req, res) => {
    let project = await ProjectModel.findOne({ shortID: req.params.shortid })

    let membersObj = { owner: {}, admins: [], users: [], };
    if (project) {
        project.members.admins.forEach(async (element) => {
            let adminObj = await UserModel.findOne({ _id: mongoose.Types.ObjectId(element) });
            membersObj.admins.push(adminObj);
        });
        project.members.users.forEach(async element => {
            let userObj = await UserModel.findOne({ _id: mongoose.Types.ObjectId(element) });
            membersObj.users.push(userObj);
        });

        try {
            let ownerObj = await UserModel.findOne({ _id: mongoose.Types.ObjectId(req.tokenData._id) });
            membersObj.owner = ownerObj;

        } catch (error) {
            console.log(error);
        }

        // console.log(membersObj);
        return res.json({ status: true, msg: "members data retrived", data: membersObj });
    }

    return res.json({ status: false, msg: "failed retriving members data..." });


}

exports.handleCommunity = async (req, res) => {
    let projects = await ProjectModel.find({ isPublic: true });

    let ps = projects;

    // ps.slice(9);
    // newPS = ps.filter(p => {
    //     return {
    //         shortID: p.shortID,
    //         ownerShortID: p.ownerShortID,
    //         name: p.name,
    //         description: p.description,
    //         dateCreated: p.dateCreated,
    //         category: p.category,
    //         members: p.members,
    // bg: p.bg,
    //     }
    // });

    return res.json({ status: true, msg: "lodeed projects..", data: ps })

}

exports.handleMembersAddition = async (req, res) => {

    let user;
    let project;

    try {
        user = await UserModel.findOne({ username: req.body.username });
        if (user === null){
            return res.json({ status: -1, msg: "failed, user not found!", sev: "error", })
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: -1, msg: "failed, db access!", sev: "error", err:error })
    }
    try {
        project = await ProjectModel.findOne({ shortId: req.params.shortId });
    } catch (error) {
        console.log(error);
        return res.json({ status: -1, msg: "failed accessing database", msgExtra: "failed accessing projects db", sev: "error", err:error })
    }
    
    try {
        if (req.body.type === "admn") {
            if( project.members.admins.includes(user.id)){
                return res.json({ status: -1, msg:"Error! user already exist", sev: "error"})
            }
            project.members.admins.push(user.id);
            project.save();

            user.projects.member.push(project.id);
            user.save();

            return res.json({ status: 1, msg:"succec! added " + req.body.username + " to admins!", sev: "success"})
        }
        if (req.body.type === "usr") {
            if( project.members.users.includes(user.id)){
                return res.json({ status: -1, msg:"Error! user already exist", sev: "error"})
            }
            project.members.users.push(user.id);
            project.save();
            user.projects.member.push(project.id);
            user.save();

            return res.json({ status: 1, msg: "succec! added " + req.body.username  + " to users!", sev: "success" })
        }
    } catch (error) {
        return res.json({ status: -1, msg: "failed adding member!", msgExtra: "fmissing...", sev: "error", err: error })

    }
}

exports.handleMembersRemoval = async (req, res) => { 

    let project;
    let user;
    let typ = req.header("type");
    let usernem = req.header("username");


    try {
        user = await UserModel.findOne({ username: usernem });
        if (user === null){
            return res.json({ status: -1, msg: "failed, user not found!", sev: "error", })
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: -1, msg: "failed, db access!", sev: "error", err:error })
    }

    try {
        project = await ProjectModel.findOne({ shortId: req.params.shortId });
    } catch (error) {
        return res.json({ status: -1, msg: "failed accessing database", msgExtra: "failed accessing projects db", sev: "error", err:error })
    }

    if(typ === "admn"){
        const index = project.members.admins.indexOf(user.id);
        console.log(typ + ", index: " +index);
        if( index === -1){
            return res.json({ status: -1, msg:"Error! user not exist, admin", sev: "error"})
        }
        project.members.admins.splice(index, 1)
        project.save();
        let index2 = user.projects.member.indexOf(project.id);
        user.projects.member.splice(index2, 1)
        user.save();
    }
    if(typ === "usr"){
        const index = project.members.users.indexOf(user.id);
        if( index === -1){
            return res.json({ status: -1, msg:"Error! user not exist, user", sev: "error"})
        }
        project.members.users.splice(index, 1)
        project.save();
        let index2 = user.projects.member.indexOf(project.id);
        user.projects.member.splice(index2, 1)
        user.save();

    }
}