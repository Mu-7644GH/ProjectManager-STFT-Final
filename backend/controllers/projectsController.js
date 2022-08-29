const { json } = require('express');
const { default: mongoose } = require('mongoose');
const { ProjectModel, validateNewProject } = require('../models/projectModel');
const { UserModel } = require('../models/userModel');


exports.handleProjectsList = async (req, res) => {
    let ownerList = await ProjectModel.find({ ownerID: req.tokenData._id });
    let userData = await UserModel.findOne({ _id: mongoose.Types.ObjectId(req.tokenData._id) });

    memberProjectsIDList = userData.projects.member;

    memberList = [];
    memberProjectsIDList.forEach(l => {
        memberList.push(async () => {
            return await ProjectModel.findOne({ _id: mongoose.Types.ObjectId(req.tokenData._id) })
        });
    });

    let projectsLists = { owner: ownerList, member: memberList }
    // let projectsLists = [...ownerList,...memberList]
    if (ownerList.length >= 1) {
        return res.json({ status: true, data: ownerList, data2: memberList, data3: projectsLists });
    }

    return res.json({ status: false, msg: "no projects found" });;
}

exports.handleProjectData = async (req, res) => {
    let projectData = await ProjectModel.find({ shortid: req.params.shortid });
    if (projectData.length >= 1) {
        return res.json({ status: true, data: projectData });
    }

    return res.json({ status: false, msg: "projects not found" });;
}

exports.handleLists_get = async (req, res) => {
    let projectLists = await ProjectModel.find({ shortID: req.params.shortid }).select({ "lists": 1, "_id": 0 });
    if (projectLists[0].lists.length >= 1) {
        return res.json({ status: true, data: projectLists[0].lists });
    }

    return res.json({ status: false, msg: "no lists were found", data: projectLists[0].lists });;
}

exports.handleNewListCreation = async (req, res) => {
    // let reqNewListShortID = req.header("listNewShortID");

    await ProjectModel.updateOne({ shortID: req.params.shortid }, { $push: { "lists": req.body } })
    await ProjectModel.updateOne({ shortID: req.params.shortid }, { $push: { "order": req.body.shortID } })

    return res.json({ msg: "new list created", });
}

exports.handleNewProjectCreation = async (req, res) => {

    let validatedBody = validateNewProject(req.body);
    console.log("project validated");

    if (validatedBody.error) {
        return res.status(400).json({
            msg0: "validation error!!",
            msg: validatedBody.error.details,
        });
    }

    try {

        // req.body.ownerUN = req.body.ownerUN;
        req.body.ownerID = req.tokenData._id;

        console.log("try adding new project");
        let newProject = new ProjectModel(req.body);
        newProject.members.admins.push(req.body.ownerID)
        await newProject.save();
        // await ProjectModel.updateOne({_id: newProject.id}, {$push: {"members.admins" : req.body.ownerID}} )

        await UserModel.updateOne({ _id: req.tokenData._id }, { $push: { "projects.owner": newProject.id } })
        console.log("project id added to user!");
        console.log("new project added!");

        // console.log("new project object: ")
        return res.json({ status: true, data: newProject });
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}

exports.handleProjectDeletion = async (req, res) => {
    console.log("-- start of delete handle!");
    await ProjectModel.deleteOne({ shortID: req.params.shortid });
}

exports.handleListDeletion = async (req, res) => {
    console.log("-- start of LIST delete handle!");
    let project = await ProjectModel.findOne({ shortID: req.params.shortid });
    project.lists = project.lists.filter((item) => item.shortID != req.params.listid);
    project.order = project.order.filter((shortID) => shortID != req.params.listid);
    project.save();
    return res.json({ msg: "list deleted succfully!" });
}

exports.handleListReorder = async (req, res) => {

    try {

        let project = await ProjectModel.updateOne({ shortID: req.params.shortid}, {$set: { "lists": req.body.data}});
        
    } catch (error) {
        console.log(error);
    }
}