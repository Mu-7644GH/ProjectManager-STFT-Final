import React from 'react'
import { useState, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {updateIsUserLoggedIn} from '../redux/userSlice';

import { Link as LinkRD, Navigate, useNavigate } from 'react-router-dom';

import axios from 'axios';

import { CalendarMonthOutlined, EmailOutlined, NotificationsNoneOutlined, StorefrontOutlined, Star } from '@mui/icons-material';
import { Box, Button, AppBar, ListItem, Stack, Link, List, Avatar, Switch, Typography } from '@mui/material';
import p0 from '../assets/people/0.jpg';
import { blue } from '@mui/material/colors/'


export default function Nav() {

  let dispatch = useDispatch();
  const navigate = useNavigate();

  // let currentIsUserLoggedIn = useSelector((state) => state.isUserLoggedIn)
  const {isUserLoggedIn : reduxIsUserLoggedIn} = useSelector((state) => state.user)
  const {test} = useSelector((state) => state.user)

  useEffect(() => {
  }, [])


  const handleSignupButtonClick = async () => {
    navigate("/signup");
  }


  const handleLogoutButton = () => {
    localStorage.setItem('isLogged', false);
    dispatch(updateIsUserLoggedIn(false));
    navigate('/');

  }

  return (

    <AppBar sx={{ bgcolor: blue[800] }} elevation={1} position='static' >
      <Box display='flex' justifyContent='space-between' alignItems='center' px={3} height='45px'>

        <Box className="App" display='flex' alignItems='center'>
          <Star fontSize='large' />
          <h1>NAME</h1>
        </Box>
        <ul>
          {reduxIsUserLoggedIn ?
            <Box display="flex" alignItems="center" gap={2}>
              <Button size='small' color='warning' variant="outlined" onClick={handleLogoutButton}>Logout</Button>
              <StorefrontOutlined color="error" />
              <CalendarMonthOutlined color="error" />
              <NotificationsNoneOutlined color="error" />
              <EmailOutlined color="error" />
              <Avatar alt="Remy Sharp" border={2} sx={{ width: 28, height: 28 }} />
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
              <Button variant='outlined' color="warning" onClick={handleSignupButtonClick}>Signup</Button>
            </Box>
          }
        </ul>
      </Box>
    </AppBar>
  )
}

