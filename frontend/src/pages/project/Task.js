import { AssignmentIndOutlined, ChatOutlined, CheckBox, CheckBoxOutlineBlank, CheckBoxOutlined, CloseOutlined, DeleteForeverOutlined, DescriptionOutlined, EditOffOutlined, EditOutlined, PauseCircleOutlineOutlined, SaveOutlined, SendOutlined, TaskOutlined, TitleOutlined } from '@mui/icons-material';
import { Box, Card, Typography, Modal, Button, Stack, IconButton, TextField, Divider } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { Draggable } from '@hello-pangea/dnd'
import { saveTaskChanges_put } from '../../services/TaskServices';
import { updateSnackbar } from '../../redux/projectsSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: { xs: "100%", md: "80%", lg: "50%" },
  minHeight: { xs: "100%", md: "80%", lg: "50%" },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
  // maxHeight:"80%"
};

export default function Task({ pProjectShortID, pListID, pItem, pTaskID, pTaskTitle, pIndex, getAllListTasks2 }) {
  const [isModalLoading, setIsModalLoading] = useState(true);
  const [taskData, setTaskData] = useState({...pItem});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const [isEditingTaskTile, setIsEditingTaskTile] = useState(false);
  const [isEditingTaskDescription, setIsEditingTaskDescription] = useState(false)

  // useEffect(() => {
  //   getTaskInfo();
  //   setIsLoading(false);
  // },[])

  const handleOpen = () => {
    if (open) {
      // console.log("alredy OPEN!!");
      // getTaskInfo();
    } else {
      setOpen(true); getTaskInfo();

    }
  };

  const handleClose = () => { setOpen(false); getTaskInfo(); };

  // let currentToken = useSelector((state) => state.accessToken);
  const { accessToken: reduxAccessToken, isUserLoggedIn: reduxIsUserLoggedIn, userShortId : reduxUserShortId, roles: reduxRoles } = useSelector((state) => state.user);
  const { openProjectData: reduxOpenProjectData } = useSelector((state) => state.projects);

  const getTaskInfo = async () => {
    let url = 'http://127.0.0.1:4000/tasks/getone/' + pProjectShortID + '/' + pListID + '/' + pTaskID;
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    try {

      let response = await axios.get(url, config).then((response) => response);
      console.log(response.data)
      setTaskData(response.data.data)
      setIsModalLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async () => {
    // setIsModalLoading(true);
    setOpen(false)
    let url = 'http://127.0.0.1:4000/tasks/del/' + pProjectShortID + '/' + pListID + '/' + pTaskID;
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    try {

      let response = await axios.delete(url, config);
      console.log(response.data)
      setTaskData(response.data.data);
      // getAllListTasks();
      getAllListTasks2();
    } catch (error) {
      console.log(error)

    }
  }

  const saveTaskChanges = async (_prp, _val, projectId = reduxOpenProjectData.shortId, taskId = pTaskID, token = reduxAccessToken) => {
    // let url = 'http://127.0.0.1:4000/tasks/' + pTaskID;
    // const config = {
    //   headers: { authtoken: reduxAccessToken }
    // }

    // const body = {
    //   prp: _prp,
    //   val: _val
    // }
    let res = await saveTaskChanges_put(_prp, _val, projectId, taskId, token);
    dispatch(updateSnackbar({ isOpen: true, msg: res.msg, sev: res.sev }))
  }

  return (
    <>
      <Draggable draggableId={pTaskID} index={pIndex} key={pTaskID}>
        {(provided) => (
          <Card elevation={3} border={1} sx={{ my: 1.5, p: 1, minWidth: "200px", "&:hover": { opacity: "70%" }, minHeight: "40px", display: "flex", flexGrow: 1, flexBasis: 0, maxHeight: "45px" }} onClick={handleOpen} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <Typography sx={{ textDecoration: taskData.isOnHold ? 'line-through' : 'none' }}>
              {/* {taskData?.title} */}
              {pTaskTitle}
              {/* {pTaskID} */}
            </Typography>
          </Card>
        )}
      </Draggable>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {
            isModalLoading ? <Typography variant='h4' alignSelf={"center"}> LOADING...</Typography> :
              <>

                <Box display="flex" justifyContent="space-between" >
                  <Box display="flex" gap={1} mb={1}>
                    <AssignmentIndOutlined />
                    <Typography sx={{ color: reduxRoles.owner || reduxRoles.admin ? "black" : "lightgray" }}>
                      Assigned to: {taskData.ownerUsername}
                    </Typography>
                  </Box>
                  <IconButton>
                    <CloseOutlined onClick={handleClose} />
                  </IconButton>
                </Box>

                <Stack p={1} border={1} maxHeight="80%" sx={{ overflow: "scroll", overflowX: "hidden" }} >
                  <Box display={"flex"} gap={1} alignItems="center" mb={1}>
                    <TitleOutlined />
                    {isEditingTaskTile
                      ? <TextField size='small' defaultValue={taskData?.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} />
                      : <Typography variant="h5" component="h3">{taskData?.title}</Typography>
                    }
                    
                      <IconButton onClick={() => { setIsEditingTaskTile(!isEditingTaskTile) }} disabled={! (reduxRoles.owner || reduxRoles.admin || taskData.ownerShortId === reduxUserShortId) }>
                        {isEditingTaskTile
                          ? <EditOffOutlined onClick={()=> saveTaskChanges("title", taskData.title)} fontSize='small' />
                          : <EditOutlined fontSize='small' />
                        }
                      </IconButton>
                    
                  </Box>

                  <Box >
                    <Box display={"flex"} gap={1} alignItems="center">
                      <DescriptionOutlined />
                      <Typography id="modal-modal-title" variant="subtitle2" component="h2">
                        Description
                      </Typography>
                      
                        <IconButton onClick={() => { setIsEditingTaskDescription(!isEditingTaskDescription) }} disabled={! (reduxRoles.owner || reduxRoles.admin || taskData.ownerShortId === reduxUserShortId) }>
                          {isEditingTaskDescription
                            ? <EditOffOutlined onClick={()=> saveTaskChanges("desc", taskData.description)} fontSize='small' />
                            : <EditOutlined   fontSize='small' />
                          }
                        </IconButton>
                      
                    </Box>
                    <Box mb={1} mt={1}>
                      {isEditingTaskDescription
                        ? <TextField size='small' fullWidth defaultValue={taskData?.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} />
                        :
                        <Typography id="modal-modal-description" variant='body2' sx={{ ml: 4, mb: 2 }}>
                          {taskData?.description ? taskData?.description : <Typography sx={{ textDecoration: "underline", color: "lightgray" }}>no description</Typography>}
                        </Typography>
                      }
                    </Box>
                  </Box>
                  <Divider orientation='horizontal' />

                  <Box display="flex" alignItems="center" gap={1}>
                    <PauseCircleOutlineOutlined />
                    <Typography pr={1}>
                      On hold:
                    </Typography>
                    <IconButton onClick={() => saveTaskChanges("hold", !taskData.isOnHold)} disabled={! (reduxRoles.owner || reduxRoles.admin || taskData.ownerShortId === reduxUserShortId) } >
                      {taskData.isOnHold
                        ? <CheckBoxOutlined />
                        : <CheckBoxOutlineBlank />
                      }
                    </IconButton>
                  </Box>
                  {/* <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TaskOutlined />
                    <Typography pr={1}>
                      Completed:
                    </Typography>
                    <IconButton onClick={() => saveTaskChanges("done", !taskData.isDone)}>
                      {taskData.isDone
                        ? <CheckBoxOutlined />
                        : <CheckBoxOutlineBlank />
                      }
                    </IconButton>
                  </Box> */}

                  {/* <Divider orientation='horizontal' /> */}

                  <Stack gap={1} my={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ChatOutlined />
                      <Typography>Chat</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} >
                      <TextField placeholder='write a comment here...' autoComplete='off' fullWidth size="small" />
                      <IconButton disabled={! (reduxRoles.owner || reduxRoles.admin || taskData.ownerShortId === reduxUserShortId)}>

                        <SendOutlined />
                      </IconButton>
                    </Box>
                    <Box border={1} sx={{ minHeight: "100px", overflow: "auto", backgroundColor: "whitesmoke" }}>

                    </Box>
                  </Stack>

                  <Box display="flex" justifyContent="end" gap={4} pr={4}>
                    <Button disabled={! (reduxRoles.owner || reduxRoles.admin || taskData.ownerShortId === reduxUserShortId)}>
                      <DeleteForeverOutlined onClick={deleteTask} fontSize='large' />
                    </Button>
                    {/* <IconButton onClick={saveTaskChanges}>
                      <SaveOutlined fontSize='large' />
                    </IconButton> */}
                  </Box>
                </Stack>
              </>
          }
        </Box>
      </Modal>
    </>
  )
}
