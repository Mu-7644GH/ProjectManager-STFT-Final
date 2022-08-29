import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, Outlet } from 'react-router-dom';
import UserHomepage from './UserHomepage'
import UserSettings from './UserSettings'
import UserInbox from './UserInbox'
import UserCalendar from './UserCalendar'
import UserNotifications from './UserNotifications'
import { Box } from '@mui/material';


export default function Uzer() {
    return (
        <Box  flex={1}>
            <Outlet />
         </Box>
    )
}
