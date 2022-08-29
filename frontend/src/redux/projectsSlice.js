import { createSlice, current } from '@reduxjs/toolkit'
import produce from 'immer'

// import type { PayloadAction } from '@reduxjs/toolkit'

// export interface projectsState {
//   value: number
// }

// const initialState: projectsState = {
//   value: 0,
// }

export const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        lists: [],
        tasks: {},
        openProjectName: "",
        test: "defaultt",
    },
    reducers: {
        updateTest: (state, action) => {
            state.test = action.payload;
        },
        updateLists: (state, action) => {
            state.lists = action.payload;
        },
        reorderTasks: (state, action) => {
            //source
            // console.log(current(state.lists[sli].tasks))
            // let ls = Object.assign({}, state.lists[sli]);

            if(action.payload.type === "taskIds-source"){
                const {listIndex, tasks : taskss} = action.payload;
                
                state.lists[listIndex].tasks = taskss;
            }else if(action.payload.type === "tasks-source"){
                const { listId, data} = action.payload;

                state.tasks = {...state.tasks, [listId] : data }
            }else if(action.payload.type === "taskIds-dest"){
                const {listIndex, tasks : taskss} = action.payload;
                
                state.lists[listIndex].tasks = taskss;
            }else if(action.payload.type === "tasks-dest"){
                const { listId, data} = action.payload;

                state.tasks = {...state.tasks, [listId] : data }
            }            



            console.log(current(state.lists))
        },
        removeTask: (state, action) => {
            
            let tmpLists = [...current(state.lists).map(obj => ({...obj}))];
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
            // state.tasks = {...state.tasks, [action.payload.listId] : action.payload.data};
        },
        updateOpenProjectName: (state, action) => {
            state.openProjectName = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateLists, updateTasks, updateOpenProjectName, reorderTasks ,removeTask, addTask, updateTest } = projectsSlice.actions

export default projectsSlice.reducer