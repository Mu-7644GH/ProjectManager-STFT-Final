import React from 'react'
import { useState, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {updateAccessToken, updateIsUserLoggedIn, updateUsername, updateUserProjectsList} from '../redux/userSlice';

import { Link as LinkRD, useNavigate, useLocation } from 'react-router-dom';

import { CalendarMonthOutlined, EmailOutlined, NotificationsNoneOutlined, StorefrontOutlined, Star, Menu } from '@mui/icons-material';
import { Box, Button, AppBar, ListItem, Stack, Link, List, Avatar, Switch, Typography, Divider, MenuItem } from '@mui/material';
import p0 from '../assets/people/0.jpg';
import { blue } from '@mui/material/colors/'
import { updateOpenProjectData } from '../redux/projectsSlice';


export default function Nav() {

  let dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // let currentIsUserLoggedIn = useSelector((state) => state.isUserLoggedIn)
  const {isUserLoggedIn : reduxIsUserLoggedIn, username: reduxUsername, roles : reduxRoles} = useSelector((state) => state.user)
  const { openProjectData : reduxOpenProjectData} = useSelector((state) => state.projects);

  useEffect(() => {
  console.log("loaded nav....")

  }, [])

  //user menue
  const [anchorEl, setAnchorEl] = useState(null);
  // const [menuOpen, setMenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignupButtonClick = async () => {
    navigate("/signup");
  }


  const handleLogoutButton = () => {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('un');
    localStorage.removeItem('sid');
    localStorage.removeItem('token');
    dispatch(updateUserProjectsList([]));
    dispatch(updateAccessToken(null));
    dispatch(updateUsername(null));
    dispatch(updateIsUserLoggedIn(false));
    dispatch(updateOpenProjectData({...reduxOpenProjectData, themeColor: "primary"}));
    
    navigate('/');

  }

  return (

    <AppBar sx={{ bgcolor: `${reduxOpenProjectData?.themeColor}.main` }} elevation={1} position='static' >
      <Box display='flex' justifyContent='space-between' alignItems='center' px={3} height='45px'>

        <Box className="App" display='flex' alignItems='center'>

          <LinkRD to="/"  style={{ textDecoration: 'none' }} >
          <Typography variant='h5' sx={{fontWeight: 'bold', color: "white", pr: 2}}  >ProjectHub</Typography>
          </LinkRD>
          {/* {reduxUsername}, Role: Owner: {reduxRoles.owner? "Owner":"n"}, Admin: {reduxRoles.admin? "y":"n"}, User: {reduxRoles.user? "y":"n"} */}
          {reduxUsername}
          {/* {reduxIsUserLoggedIn &&
          `, Role: ${reduxRoles?.owner? "Owner":""} ${reduxRoles?.admin? "Admin":""} ${reduxRoles?.user? "User":""} `} */}
        </Box>
        <ul>
          {reduxIsUserLoggedIn == true ? 
            <Box display="flex" alignItems="center" gap={2}>
              <Button size='small' color='warning' variant="outlined" onClick={handleLogoutButton}>Logout</Button>
              <StorefrontOutlined color="error" onClick={() => { navigate('/community')}}/>
              <CalendarMonthOutlined color="error" />
              <NotificationsNoneOutlined color="error" />
              <EmailOutlined color="error" />
              <Avatar id="basic-menu" alt="Remy Sharp" border={2} sx={{ width: 28, height: 28 }} onClick={handleClick}/>
            </Box>
            :
            <Box display='flex' alignItems={"center"}  >
              <List sx={{ display: "flex", flexDirection: "row" }}>

                <ListItem>
                  <Link underline="hover" color="white" onClick={() => { navigate("/contactus") }} mx={0}>
                    ABOUT
                  </Link>
                </ListItem>
                <ListItem>
                  <Link underline="hover" color="white" onClick={() => { navigate("/contactus") }} mx={0}>
                    FAQ
                  </Link>
                </ListItem>
                <ListItem>
                  <Link underline="hover" color="white" onClick={() => { navigate("/contactus") }} whiteSpace="nowrap" mx={0}>
                    CONTACT US
                  </Link>
                </ListItem>
              </List>
              {/* <Button variant='outlined'  color={"custom_indigo"} onClick={handleSignupButtonClick}>Signup</Button> */}
              {/* {location.pathname !== '/' && <Button  variant='outlined' color={"custom_indigo"} onClick={() => {navigate('/')}}  >Login</Button> } */}
            </Box>
          }
        </ul>
      </Box>
      <div>
      {/* <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu> */}
    </div>
    </AppBar>
  )
}

