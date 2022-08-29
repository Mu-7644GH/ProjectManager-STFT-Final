import { configureStore } from '@reduxjs/toolkit'
import projectsReducer from './projectsSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    user: userReducer,
  },

})

export default store;