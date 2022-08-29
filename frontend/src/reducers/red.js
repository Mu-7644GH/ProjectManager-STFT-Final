const stateInit = {
    accessToken: "none",
    isUserLoggedIn: false,
    // userProjectsData: [{name: "default", description: "default", owner: "default", admins: []}],
    userProjectsData: {owner: [], member: []},
    localProjectsData: [{}],
    projectData: {lists: [{ pos: 0, title: "none", isLocked: false, tasks: [] }]},
    lists: [],
    listsOrder: [],
    username: "none",
    userShortID: "none",
    currentProjectName: "",
    userData: {
        username: "default",
        shortID: "default",
    },
    isLoading: true,
}

export const myReducer = (state = stateInit, action) => {
    if(action.type === "updateAccessToken"){
        return {...state, accessToken: action.payload}
    }
    if(action.type === "updateUsername"){
        return {...state, username: action.payload}
    }
    if(action.type === "updateUserShortID"){
        return {...state, userShortID: action.payload}
    }
    if(action.type === "updateUserProjectsData"){
        return {...state, userProjectsData: action.payload}
    }
    if(action.type === "updateLists"){
        return {...state, lists: action.payload}
    }
    if(action.type === "updateListsOrder"){
        return {...state, listsOrder: action.payload}
    }
    if(action.type === "updateUserProjectsList"){
        return {...state, userProjectsList: action.payload}
    }
    if(action.type === "updateIsUserLoggedIn"){
        return {...state, isUserLoggedIn: action.payload}
    }
    if(action.type === "downloadProjectData"){
        return {...state, projectData: action.payload}
    }
    if(action.type === "addListToProject"){
        let newlist = state.projectData.lists.push(action.payload);
        return {...state, projectData: {...state.projectData, lists: newlist}}
    }
    if(action.type === "updateCurrentProjectName"){
        return {...state, currentProjectName: action.payload}
    }
    return state;
}