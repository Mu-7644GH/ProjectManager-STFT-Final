import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'

// export interface projectsState {
//   value: number
// }

// const initialState: projectsState = {
//   value: 0,
// }

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accessToken: "",
        username: "",
        userID: "",
        userShortId: "",
        isUserLoggedIn: false,
        // test: "lalala",
        userProjectsList: [],
        // userData: [],
        roles:{owner: false,admin: false,user: false}
    },
    reducers: {
        // updateUserData: (state, action) => {
        //     state.userData = action.payload;
        // },
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        updateUsername: (state, action) => {
            state.username = action.payload;
        },
        updateUserShortId: (state, action) => {
            state.userShortId = action.payload;
        },
        updateIsUserLoggedIn: (state, action) => {
            state.isUserLoggedIn = action.payload;
        },
        updateUserProjectsList: (state, action) => {
            state.userProjectsList = action.payload;
        },
        updateUserRoles: (state, action) => {
            state.roles = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateAccessToken, updateUsername, updateUserShortId, updateIsUserLoggedIn, updateUserProjectsList, updateUserRoles } = userSlice.actions
export default userSlice.reducer