import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
// import {createThe}
import { GetDerivedStateFromProps } from 'react';

import { Box, TextField, Button, Stack, Typography, Divider } from '@mui/material'
import { DeleteForeverOutlined, MoreHorizOutlined, InfoOutlined } from '@mui/icons-material';
import { Droppable, Draggable } from '@hello-pangea/dnd'

import TaskComp from './Task'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { updateTasks, updateSnackbar } from '../../redux/projectsSlice';

export default function List(props) {

  const scrollStyle = {
    "&::-webkit-scrollbar": {
      width: "3px",
    },

    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 5px rgb(255, 251, 251)",
      borderRadius: "10px",
    },

    "&::-webkit-scrollbar-thumb": {
      background: "#077DFA",
      borderRadius: "10px",
    },

    "&::-webkit-scrollbar-thumb:hover": {
      background: "rgb(255, 251, 251)",
    }
  }

  const dispatch = useDispatch();
  const { accessToken: reduxAccessToken, roles: reduxUserRoles } = useSelector((state) => state.user);
  const { tasks: reduxProjectTasks, snackbar: reduxSnackbar, lists: reduxProjectLits } = useSelector((state) => state.projects);
  // const { test: reduxProjectTest } = useSelector((state) => state.projects);

  const newTaskTitleRef = useRef();
  const [tasks, setTasks] = useState({});
  const [listLoading, setListloading] = useState(true);

  const handleListInfo = () => {
    window.alert("token: \n" + reduxAccessToken + "\n \n list id:" + props.pList.shortID + "\n input: " + newTaskTitleRef.current.value);
  }

  useEffect(() => {
    // loadTasksProp();
    props.getAllListTasks()
 
    // props.ploadTasks(props.pList._id);
    // setTasks(reduxProjectTasks);
  }, []);

  const getAllListTasks = async () => {
    let url = 'http://127.0.0.1:4000/tasks/getall/' + props.pProjectShortID + '/' + props.pList._id;
    const config = {
      headers: { authtoken: localStorage.getItem('token') }
    }

    try {

      let response = await axios.get(url, config).then((response) => response);
      console.log(response.data.msg)
      // let newObj = {
      //   ...reduxProjectTasks,
      //   `${props.pList._id}` : response.data.data
      // }
      // dispatch(updateTasks({listId: props.pList._id, data: response.data.data} ))
      // setTasks(reduxProjectTasks);
      dispatch(updateTasks(response.data.data))

    } catch (error) {
      console.log(error)
    }
  }

  const getListTaskData = () => {
    // props.getAllListTasks();
    // reduxProjectTest[props.pTask._id]

  }

  const handleNewTask = async () => {
    let url = 'http://127.0.0.1:4000/tasks/add/' + props.pProjectShortID + '/' + props.pList._id;
    let data = {
      title: newTaskTitleRef.current.value,
      listId: props.pList._id,
    }
    const config = {
      headers: { authtoken: localStorage.getItem('token') }
    }

    try {

      let response = await axios.post(url, data, config);
      console.log(response.data)
      // let tmpTasks = {...reduxProjectTasks};
      // tmpTasks[props.pList._id].push(response.data.task)

      // dispatch(updateTasks({...reduxProjectTasks, [props.pList._id]: tmpTasks[props.pList._id]}))
      // props.getAllListTasks();
    } catch (error) {
      console.log(error)
    }

    props.getAllListTasks();
    newTaskTitleRef.current.value = "";

  }

  return (
    
    <Draggable draggableId={props?.pList?._id} index={props?.pIndex} key={props?.pList?._id}>
      {provided =>
        <Stack  minWidth="280px" maxWidth="280px" p={1.5} height="8-px"  bgcolor="whitesmoke" sx={{ boxShadow: 2, alignItems: "center", borderRadius: "0.5em" }} {...provided.draggableProps} ref={provided.innerRef}>
        
        <Stack direction={"row"} sx={{ width: "100%", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
          <Box sx={{flex: 1}} {...provided.dragHandleProps}>

            <Typography variant='h6' >
              {props.pList.title}
              {/* , {props.pList.tasks.length} */}
            </Typography>
          </Box>
            <Box>
              {/* <InfoOutlined onClick={handleListInfo} fontSize="small" /> */}
              <DeleteForeverOutlined size="small" sx={{display: reduxUserRoles.owner || reduxUserRoles.admin? "inline": "inline" }} onClick={() => { props.pHandleListDelete(props.pList._id) }} />
              {/* <MoreHorizOutlined fontSize="small" onClick={() => {if(reduxUserRoles?.owner){return}else{  let nsb = {isOpen: true, msg: "owner only"}; dispatch(updateSnackbar(nsb)); window.alert(reduxUserRoles.user);} }}/> */}
            </Box>
          </Stack>
          

          <Droppable droppableId={props.pList._id} type={"task"}>
            {provided => (
              <Stack border={1} px={1.5} py={1} sx={{borderColor: "lightgray", alignItems: "center", maxHeight: "68vh", overflow: "auto", overflowX: "hidden", width: "240px", maxWidth: "240px", minHeight: "160px", }} ref={provided.innerRef} {...provided.droppableProps}>
                {/* {provided.placeholder} */}
                {
                    reduxProjectTasks[props?.pList?._id]?.map((task, index) => {
                      return (
                      <TaskComp pIndex={index} key={task?._id} pTask={task} pProjectShortID={props?.pProjectShortID} pListID={props?.pList?._id} pTaskID={task?._id} pTaskTitle={task?.title} getAllListTasks2={props.getAllListTasks} />
                      )
                  })
                }
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
          
          <Stack pt={4} textAlign="center" justifyContent="center" sx={{display: reduxUserRoles.owner || reduxUserRoles.admin ? "block" : "none"}}>
          <Divider orientation="horizontal" flexItem={true}/>
            <TextField inputRef={newTaskTitleRef} onKeyDown={(e) => { if (e.key === 'Enter') handleNewTask(); }} size='small' type="text" autoComplete='false' />
            <Button onClick={handleNewTask} >Add task</Button>
          </Stack>
        </Stack>
      }
    </Draggable>
  )
}
