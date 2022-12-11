import { createSlice, current } from '@reduxjs/toolkit'
import produce from 'immer'

export const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        lists: [],
        tasks: {},
        openProjectName: "nonee",
        openProjectData: "",
        themeColor: "primary",
        snackbar: { isOpen: false, msg: "none", sev: "info" },
        isSettingsChanged: false,
        changedSettingsFlags: {
            name: 0,
            isPublic: 0,
            tags: 0,
            themeColor: 0,
            bg: 0,
        },
    },
    reducers: {
        updateThemeColor: (state, action) => {
            state.themeColor = action.payload;
        },
        updateLists: (state, action) => {
            state.lists = action.payload;
        },
        reorderTasks: (state, action) => {

            if (action.payload.type === "taskIds-source") {
                const { listIndex, tasks: taskss } = action.payload;

                state.lists[listIndex].tasks = taskss;
            } else if (action.payload.type === "taskIds-dest") {
                const { listIndex, tasks: taskss } = action.payload;

                state.lists[listIndex].tasks = taskss;
            } else if (action.payload.type === "taskIds-source-dest") {
                const { sli, stl, dli, dtl } = action.payload;

                let sts = state.lists;

                sts[sli].tasks = stl;
                sts[dli].tasks = dtl;

                state.lists = sts;

                // state.lists[sli].tasks = stl;
                // state.lists[dli].tasks = dtl;
            } else if (action.payload.type === "tasks-source") {
                const { listId, data } = action.payload;

                state.tasks = { ...state.tasks, [listId]: data }
            } else if (action.payload.type === "tasks-dest") {
                const { listId, data } = action.payload;

                state.tasks = { ...state.tasks, [listId]: data }
            }



            // console.log(current(state.lists))
        },
        removeTask: (state, action) => {

            let tmpLists = [...current(state.lists).map(obj => ({ ...obj }))];
            // let tmpLists = [...state.lists];
            let sli = action.payload.SLI;
            let si = action.payload.SI;

            console.log(action);
            console.log(tmpLists);
            // console.log(current(state.lists))

            tmpLists[sli].tasks.splice(si, 1);
            // state.lists[sli].tasks = current( state.lists[sli].tasks).splice(si, 1);



            // console.log(tmpLists);
            // console.log(current( state.list/s));
            console.log("Sliced!!!");
        },
        addTask: (state, action) => {
            let tmpLists = state.lists;

            let dli = action.payload.DLI;
            let di = action.payload.DI;
            let gid = action.payload.GID;
            tmpLists[dli].tasks.splice(di, 0, gid);

            state.lists = tmpLists;

            console.log("Slice Added!!!");


        },
        updateTasks: (state, action) => {
            state.tasks = action.payload;
        },
        updateOpenProjectName: (state, action) => {
            state.openProjectName = action.payload;
        },
        updateOpenProjectData: (state, action) => {
            state.openProjectData = action.payload;
        },
        updateProjectName: (state, action) => {
            state.openProjectData.name = action.payload;
        },
        updateProjectIsPublic: (state, action) => {
            state.openProjectData.isPublic = action.payload;
        },
        updateProjectTags: (state, action) => {
            state.openProjectData.tags = action.payload;
        },
        updateProjectThemeColor: (state, action) => {
            state.openProjectData.themeColor = action.payload;
        },
        updateProjectBackground: (state, action) => {
            state.openProjectData.bg = action.payload;
        },
        updateIsSettingsChanged: (state, action) => {
            state.isSettingsChanged = action.payload;
        },
        updateChangedSettingsFlags: (state, action) => {
            state.changedSettingsFlags = action.payload;
        },
        updateSnackbar: (state, action) => {
            state.snackbar = action.payload;
        },
    },
})

export const {
    updateLists,
    updateTasks,
    updateOpenProjectName,
    reorderTasks,
    removeTask,
    addTask,
    updateTest,
    updateOpenProjectData,
    updateThemeColor,
    updateProjectName,
    updateProjectIsPublic,
    updateProjectTags,
    updateProjectThemeColor,
    updateProjectBackground,
    updateIsSettingsChanged,
    updateChangedSettingsFlags,
    updateSnackbar,
} = projectsSlice.actions

export default projectsSlice.reducer