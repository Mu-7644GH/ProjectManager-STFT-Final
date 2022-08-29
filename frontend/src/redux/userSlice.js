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
        test: "lalala",
        userProjectsList: [],
    },
    reducers: {
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
    },
})

// Action creators are generated for each case reducer function
export const { updateAccessToken, updateUsername, updateUserShortId, updateIsUserLoggedIn, updateUserProjectsList } = userSlice.actions

export default userSlice.reducer