import React from 'react'
import { useRef, useEffect } from 'react'
import axios from 'axios'


import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateAccessToken, updateUserShortId, updateUsername, updateUserProjectsList } from '../../redux/userSlice';

// import newNanoID from '../../utils/nanoids'
// import { nanoid } from 'nanoid'
import {newNanoID } from '../../utils/nanoid';

import { Box, Stack, Typography, IconButton, FormControl, FormControlLabel, FormGroup, Card, TextField, Alert, Button, Container } from '@mui/material'
import { AddCircleOutlineOutlined } from '@mui/icons-material';

import ProjectSummary from '../../components/ProjectSummary'
import { useNavigate } from 'react-router-dom';

export default function UserHomepage() {

  let dispatch = useDispatch();
  const {accessToken : reduxAccessToken} = useSelector((state) => state.user)
  const {username : reduxUsername} = useSelector((state) => state.user)
  const {userShortId : reduxUserShortId} = useSelector((state) => state.user)
  const {userProjectsList : reduxUserProjectsList} = useSelector((state) => state.user)


  // let currentToken = useSelector((state) => state.accessToken);
  // let currentUserProjectsList = useSelector((state) => state.userProjectsData);
  // let currentUsername = useSelector((state) => state.username);
  // let currentUserShortID = useSelector((state) => state.userShortID);
  // let currentProjectName = useSelector((state) => state.currentProjectName);
  // let currentUserData = useSelector((state) => state.userData);
  const nanoid = newNanoID(10);

  const navigate = useNavigate();
  const projectNameInputRef = useRef();
  const projectDescriptionInputRef = useRef();


  useEffect(() => {
    getUserProjects();
  }, [])

  const getUserProjects = () => {
    const url = 'http://127.0.0.1:4000/projects/getall';
    const config = {
      // headers: { authtoken: currentToken }
      headers: { authtoken: localStorage.getItem('token') }
    }

    axios.get(url, config).then(function (response) {
      if (response.data.status) {

        // console.log("response projects list: ");
        // console.log(response.data)

        // dispatch({ type: "updateUserProjectsData", payload: response.data.data3 });
        dispatch(updateUserProjectsList(response.data.data3));
        // return;
      } else {
        // dispatch({ type: "updateUserProjectsData", payload: [] });
        dispatch(updateUserProjectsList([]));
      }

      // console.log(response.data);
    })
      .catch(function (error) {
        console.log(error);
      });
  }


  const submitNewProject = (e) => {
    e.preventDefault();
    const url = 'http://127.0.0.1:4000/projects/add';
    const data = {
      name: projectNameInputRef.current.value,
      description: projectDescriptionInputRef.current.value,
      ownerUN: reduxUsername,
      ownerShortID: reduxUserShortId,
      // shortID: nanoid(10),
      shortID: nanoid(10),
    }

    projectNameInputRef.current.value = "";
    projectDescriptionInputRef.current.value = "";

    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    axios.post(url, data, config).then(function (response) {
      if (response.data.status) {
        console.log("new project response:  ");
        console.log(response.data.data);
        // dispatch({ type: "updateUserProjectsList", payload: [...currentUserProjectsList, response.data.data] })
        dispatch(updateUserProjectsList(response.data.data));
      } else {

      }
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (

    <Box display={"flex"} flexDirection="column" alignItems={"center"} justifyContent="space-around" bg="error" border={2} height="100%">
      
      <Card elevation={3} sx={{ display: "flex", height: 200, width: "70%", my: 3, py: 1 }}>
        {/* <Box bgcolor="gray" sx={{ width: "30%", borderColor: "red" }} border={1} mx={2} /> */}
        <Stack direction="row" justifyContent={"space-between"} width="80%">
          <Stack direction={"column"} mx={4} mt={1} width="80%">
            <TextField inputRef={projectNameInputRef} label="project name" size="small" margin="none" />
            <TextField inputRef={projectDescriptionInputRef} multiline maxRows={4} label="project description..." margin="dense" sx={{ width: "100%", flex: 1 }} />
            {/* <Typography fontSize={"8px"} sx={{ border: 1, wordWrap: 'break-word' }}>Token: {currentToken}</Typography> */}
          </Stack>
          <IconButton sx={{ marginLeft: "auto" }} onClick={submitNewProject}>
            <AddCircleOutlineOutlined fontSize='large' mx={4} />
          </IconButton>
        </Stack>
      </Card>

      <Stack direction={"row"}>
        <Button onClick={getUserProjects}> refresh</Button>
        <Button onClick={() => { window.alert("token: " + reduxAccessToken + "\n" + "usrName: " + reduxUsername + "\n" + "userID: " + reduxUserShortId + "\n" + "num: " + (reduxUserProjectsList.owner.length + reduxUserProjectsList.member.length) ) }}>
          info
        </Button>
      </Stack>

        <Typography>Owner</Typography>
      <Container sx={{ bgcolor: "lightgray", width: "80%", height: "200px", alignItems: "center", display: "flex", flexDirection: "column", overflow: "scroll", overflowX: "hidden", border: 1 }}>
        {
          reduxUserProjectsList.owner?.map((project, index) => {
            return (
              <ProjectSummary key={index} pProjectName={project.name} pProjectDescription={project.description} pProjectShortID={project.shortID} />
            )
          })
        }
      </Container>
      
      <Typography>Member</Typography>
      <Container sx={{ bgcolor: "lightblue", width: "80%", alignItems: "center", display: "flex", flexDirection: "column" }}>
        {
          reduxUserProjectsList.member?.map((project, index) => {
            return (
              <ProjectSummary key={index} pProjectName={project.name} pProjectDescription={project.description} pProjectShortID={project.shortID} />
            )
          })
        }
      </Container>
    </Box>
  )
}
