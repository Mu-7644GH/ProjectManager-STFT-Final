import React, { useState } from 'react'
import { useRef, useEffect } from 'react'
import axios from 'axios'


import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateAccessToken, updateUserShortId, updateUsername, updateUserProjectsList } from '../../redux/userSlice';
import { updateSnackbar } from '../../redux/projectsSlice';

// import newNanoID from '../../utils/nanoids'
// import { nanoid } from 'nanoid'
import { newNanoID } from '../../utils/nanoid';

import { Box, Stack, Typography, IconButton, FormControl, FormControlLabel, FormGroup, Card, TextField, Alert, Button, Container, Divider, Tabs, Tab, Modal } from '@mui/material'
import { AddCircleOutlineOutlined, AddOutlined, Try } from '@mui/icons-material';

import ProjectSummary from '../../components/ProjectSummary'
import { useNavigate } from 'react-router-dom';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import { createNewUserProject, getUserProjectsLists } from '../../services/ProjectServices';

export default function UserHomepage() {

  let dispatch = useDispatch();
  const navigate = useNavigate();
  const nanoid = newNanoID(10);


  const { accessToken: reduxAccessToken } = useSelector((state) => state.user)
  const { username: reduxUsername } = useSelector((state) => state.user)
  const { userShortId: reduxUserShortId } = useSelector((state) => state.user)
  const { userProjectsList: reduxUserProjectsList } = useSelector((state) => state.user)
  // const { snackbar: reduxSnackbar } = useSelector((state) => state.projects);
  // const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  useEffect(() => {
    // getUserProjects();
    // loadLocal();
    getAPI();
    // console.log("loaded UserHomepage....")


  }, [])

  const getAPI = async () => {
    let data = await getUserProjectsLists(reduxAccessToken);
    dispatch(updateUserProjectsList(data));
    setIsLoaded(true);
  }

  //new project modal
  const [isLoaded, setIsLoaded] = useState(false);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [refresh, setRefresh] = useState();
  const projectDescriptionInputRef = useRef();
  const projectNameInputRef = useRef();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    minWidth: { xs: "100%", md: "80%", lg: "50%" },
    minHeight: { xs: "100%", md: "80%", lg: "50%" },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleNewProjectModalClose = () => {
    setNewProjectModal(false);
  }


  const loadLocal = async () => {

    dispatch(updateUsername(localStorage.getItem('un')))
    dispatch(updateUserShortId(localStorage.getItem('sid')))
    dispatch(updateAccessToken(localStorage.getItem('token')))

  }

  const submitNewProject = async (e) => {
    e.preventDefault();

    let name = projectNameInputRef.current.value.trim().replace(/\s/g, ' ');
    let description = projectDescriptionInputRef.current.value;
    let ownerUsername = reduxUsername;
    let ownerShortId = localStorage.getItem('sid');
    let shortId = nanoid(10);

    let res = await createNewUserProject(name, description, ownerUsername, ownerShortId, shortId, reduxAccessToken);

    let nsb = {}
    nsb = { isOpen: true, msg: res.msg, sev: res.sev };
    dispatch(updateSnackbar(nsb));

    // const url = 'http://127.0.0.1:4000/projects/add';
    // const data = {
    //   name: projectNameInputRef.current.value,
    //   description: projectDescriptionInputRef.current.value,
    //   ownerUN: reduxUsername,
    //   ownerShortID: localStorage.getItem('sid'),
    //   shortID: nanoid(10),
    // }

    // projectNameInputRef.current.value = "";
    // projectDescriptionInputRef.current.value = "";

    // const config = {
    //   headers: { authtoken: reduxAccessToken }
    // }
    // let nsb = {}
    // axios.post(url, data, config).then(function (response) {
    //   if (response.data.status) {
    //     console.log("new project response:  ");
    //     console.log(response.data.data);
    //     // dispatch({ type: "updateUserProjectsList", payload: [...currentUserProjectsList, response.data.data] })
    //     nsb = {isOpen: true, msg: response.data.msg, sev: "success"};
    //     dispatch(updateSnackbar(nsb)); 
    //     dispatch(updateUserProjectsList(response.data.data));
    //     // getUserProjects();
    //     getAPI();
    //   } else {
    //     nsb = {isOpen: true, msg: response.data.msg, sev: "error"};
    //     dispatch(updateSnackbar(nsb)); 
    //   }
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }

  const deleteFromItem = (_msg, _sev = "info") => {
    getAPI();
  }

  return (

    <Box display={"flex"} flexDirection="column" alignItems={"center"} justifyContent="space-around" height="100%">
      <Divider orientation='horizontal' flexItem={true} />
      {isLoaded &&
        <>
          <Container sx={{ bgcolor: "whitesmoke", width: "70%", maxHeight: "250px", alignItems: "center", display: "flex", flexDirection: "column", overflow: "auto", overflowX: "hidden", border: 1, py: 2 }}>
            <Box display={"flex"} alignItems="center" gap={2} py={1}>
              <Typography>My Projects: </Typography>
              <Button variant='contained' size='small' endIcon={<AddOutlined />} onClick={() => setNewProjectModal(true)} >
                Add
              </Button>
            </Box>
            {reduxUserProjectsList?.owner?.length >= 1 ?
              <>
                {
                  reduxUserProjectsList?.owner?.map((project, index) => {
                    return (
                      <ProjectSummary pBG={project?.bg} membership={"owner"} key={index} pProjectName={project?.name} pProjectDescription={project?.description} pProjectShortId={project?.shortId} deleteFromItem={deleteFromItem} />
                    )
                  })
                }
              </>
              :
              <Alert variant="outlined" severity="info">
                You have 0 Project. Create one now.
              </Alert>
            }
          </Container>

          <Container sx={{ bgcolor: "whitesmoke", width: "70%", border: 1, maxHeight: "250px", alignItems: "center", display: "flex", overflow: "auto", flexDirection: "column", py: 2 }}>
            <Box py={1}>
              <Typography >Member:</Typography>
            </Box>
            {reduxUserProjectsList?.member?.length >= 1 ?
              <>
                {
                  reduxUserProjectsList?.member?.map((project, index) => {
                    return (
                      <ProjectSummary pBG={project?.bg} membership={"member"} key={index} pProjectName={project?.name} pProjectDescription={project?.description} pProjectShortId={project?.shortId} refreshMain={deleteFromItem} />
                    )
                  })
                }
              </>
              :
              <Alert variant="outlined" severity="info" sx={{ alignSelf: "center" }}>
                You aren't member of any project.
              </Alert>
            }
          </Container>
        </>
      }
      <Modal
        open={newProjectModal}
        onClose={handleNewProjectModalClose}
      >
        <Card elevation={3} sx={{
          display: "flex", height: 200, width: "50%", my: 3, py: 1, position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
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
      </Modal>
      <SimpleSnackbar />
    </Box>
  )
}
