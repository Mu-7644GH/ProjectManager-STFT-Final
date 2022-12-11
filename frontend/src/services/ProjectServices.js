import axios from 'axios'

//USER
export const getUserProjectsLists = async (_accessToken) => {
  const url = 'http://127.0.0.1:4000/projects/user-projects-lists';

  const config = {
    headers: { authtoken: _accessToken }
  }

  try {
    let res = await axios.get(url, config);
    if (res.data.status) {
      return res.data.data3;

    }
    return [];
  } catch (error) {
    console.log(error);

  }
}

export const loadUserProjectRoles = async (_accessToken, _projectShortId) => {
  let url = 'http://127.0.0.1:4000/users/get_roles/' + _projectShortId;
  const config = {
    headers: { authtoken: _accessToken }
  }

  try {

    let response = await axios.get(url, config).then((response) => response);
    if (response.data.status) {
      // console.log(response.data.msg);
      // console.log(response.d/ata);
      return response.data.data;

    } else {
      console.log(response.data.msg)
    }
  } catch (error) {
    console.log(error)
  }
}

export const addMembers_put = async (_type, _username, _accessToken, _projectShortId) => {
  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/members'  ;
  let data = {
    type: _type,
    username: _username,
  }
  const config = {
    headers: { authtoken: _accessToken },
  }

  try {

    let response = await axios.put(url, data, config);
    return response.data;
  } catch (error) {
    console.log(error);
    return { status: 0, msg: "Error, failed getting data from server!", sev: "error", err: error };
  }
}

export const removeMember_del = async (_type, _username, _accessToken, _projectShortId) => {
  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/members'  ;
  let data = {
    type: _type,
    username: _username,
  }
  const config = {
    headers: { authtoken: _accessToken, type: _type, username: _username },
  }

  try {

    let response = await axios.delete(url, config);
    return response.data;
  } catch (error) {
    console.log(error);
    return { status: 0, msg: "Error, failed getting data from server!", sev: "error", err: error };
  }
}


//PROJECT
export const createNewUserProject = async (_name, _description, _ownerUsername, _ownerShortId, _shortId, _accessToken) => {

  const url = 'http://127.0.0.1:4000/projects/';
  const data = {
    name: _name,
    description: _description,
    ownerUsername: _ownerUsername,
    ownerShortId: _ownerShortId,
    shortId: _shortId,
  }

  const config = {
    headers: { authtoken: _accessToken }
  }
  try {

    let res = await axios.post(url, data, config);
    if (res.data.status) {
      return res.data;
    } else {
      return res.data;
    }
  } catch (error) {
    console.log(error);
    return { data: {}, msg: error, sev: "error" };
  }
}

export const deleteProject = async (_projectShortId, _membership, _accessToken) => {
  const url = 'http://127.0.0.1:4000/projects/' + _projectShortId;
  const config = {
    headers: { authtoken: _accessToken, membership: _membership }
  }

  try {
    let response = await axios.delete(url, config);
    return response.data;

  } catch (error) {
    return { msg: error, sev: "error" };
  }
  // props.deleteFromItem(response.data.msg);


}

export const getOpenProjectData = async (_accessToken, _projectShortId) => {
  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId;
  const config = {
    headers: { authtoken: _accessToken }
  }

  try {
    let response = await axios.get(url, config);
    // console.log(response.data.msg);
    // console.log(response.data.data);
    return response.data;

  } catch (error) {
    console.log(error);
  }
  // console.log(response.data)

}

export const getProjectMembers = async (_accessToken, _projectShortId) => {
  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/members/';
  const config = {
    headers: { authtoken: _accessToken }
  }

  try {

    let response = await axios.get(url, config).then((response) => response);
    if (response.data.status) {
      console.log(response.data.msg);
      console.log(response.data);
      return response.data.data;

    } else {
      console.log(response.data.msg)
    }
  } catch (error) {
    console.log(error)
  }


}

export const updateProjectSettings_put = async (_name, _isPublic, _tags, _themeColor, _bg, _projectShortId, _accessToken) => {
  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/settings';
  let data = {
    // shortID: listID,
    name: _name,
    isPublic: _isPublic,
    tags: _tags,
    themeColor: _themeColor,
    bg: _bg,
  }
  const config = {
    headers: { authtoken: _accessToken },
  }

  try {

    let response = await axios.put(url, data, config);
    return response.data;
  } catch (error) {
    console.log(error);
    return { status: 0, msg: "Error, failed getting data from server!", sev: "error", err: error };
  }
}

export const saveSettingsChanges_put = async(__key, __value, _projectShortId, _accessToken,) => {
  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/settings';
  let data = {
    key: __key,
    value: __value,
  }
  const config = {
    headers: { authtoken: _accessToken },
  }

  try {

    let response = await axios.put(url, data, config);
    return response.data;
  } catch (error) {
    console.log(error);
    return { status: 0, msg: "Error, failed getting data from server!", sev: "error", err: error };
  }
}

//LIST
export const createNewList_post = async (_title, _projectShortId, _accessToken) => {

  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/lists';
  // let listID = nanoid(10);
  let data = {
    // shortID: listID,
    title: _title,
    isLocked: false,
    tasks: [],
  }
  const config = {
    headers: { authtoken: _accessToken },
  }

  //localy
  // dispatch({type: "addListToProject",payload: data})

  let response = await axios.post(url, data, config);
  return response.data;
  // console.log(response.data.data);
  // getAllProjectLists();
  // newListTitleRef.current.value = "";
}

export const deleteList = async (_listId, _projectShortId, _accessToken) => {
  // console.log(_listID);

  const url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/lists/' + _listId;
  const config = {
    headers: { authtoken: _accessToken }
  }

  let response = await axios.delete(url, config);
  return response.data;
  // console.log("done : handleListDelete...");
  // getAllProjectLists();
}

export const updateTasksOrder_put = async (_listId, _tasks, _index, _projectShortId, _accessToken) => {
  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/tasks-order';
  let data = {
    listId: _listId,
    tasks: _tasks,
    index: _index,
  }
  const config = {
    headers: { authtoken: _accessToken },
  }

  try {
    let response = await axios.put(url, data, config);
    // console.log("done: updateTasksReorder...");
    return response.data;
  } catch (error) {
    console.log(error);
    return { status: 0, msg: "Error, failed getting data from server!", sev: "error" };
  }
}

export const updateListsOrder_put = async (_si, _di, _lists, _projectShortId, _accessToken) => {
  let url = 'http://127.0.0.1:4000/projects/' + _projectShortId + '/lists-reorder';
  let data = {
    data: _lists,
  }
  const config = {
    headers: { authtoken: _accessToken },
  }

  try {

    let response = await axios.put(url, data, config);
    // console.log("done: updateListsReorder...");
    return response.data;
  } catch (error) {
    console.log(error);
    return { status: 0, msg: "Error, failed getting data from server!", sev: "error", err: error };
  }
}




