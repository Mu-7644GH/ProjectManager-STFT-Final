import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
// import {createThe}
import { GetDerivedStateFromProps } from 'react';

import { Box, TextField, Button, Stack, Typography } from '@mui/material'
import { DeleteForeverOutlined, MoreHorizOutlined, InfoOutlined } from '@mui/icons-material';
import { Droppable, Draggable } from '@hello-pangea/dnd'

import TaskComp from './Task'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { updateTasks } from '../../redux/projectsSlice';

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
  const { accessToken: reduxAccessToken } = useSelector((state) => state.user);
  const { tasks: reduxProjectTasks } = useSelector((state) => state.projects);
  const { test: reduxProjectTest } = useSelector((state) => state.projects);

  const newTaskTitleRef = useRef();
  const [tasks, setTasks] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleListInfo = () => {
    window.alert("token: \n" + reduxAccessToken + "\n \n list id:" + props.pList.shortID + "\n input: " + newTaskTitleRef.current.value);
  }

  useEffect(() => {
    // loadTasksProp();
    // getAllListTasks()
    props.ploadTasks();
    // setTasks(reduxProjectTasks);
  }, []);

  const getAllListTasks = async () => {
    let url = 'http://127.0.0.1:4000/tasks/getall/' + props.pProjectShortID + '/' + props.pList._id;
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    try {

      let response = await axios.get(url, config).then((response) => response);
      console.log(response.data)
      // let newObj = {
      //   ...reduxProjectTasks,
      //   `${props.pList._id}` : response.data.data
      // }
      // dispatch(updateTasks({listId: props.pList._id, data: response.data.data} ))
      // setTasks(reduxProjectTasks);
      // dispatch(updateTasks(response.data.data))

    } catch (error) {
      console.log(error)
    }
  }

  const getListTaskData = () => {
    // props.ploadTasks();
    // reduxProjectTest[props.pTask._id]

  }

  const handleNewTask = async () => {
    let url = 'http://127.0.0.1:4000/tasks/add/' + props.pProjectShortID + '/' + props.pList._id;
    let data = {
      title: newTaskTitleRef.current.value
    }
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    try {

      let response = await axios.post(url, data, config).then((response) => response);
      console.log(response.data)
      // let tmpTasks = {...reduxProjectTasks};
      // tmpTasks[props.pList._id].push(response.data.task)

      // dispatch(updateTasks({...reduxProjectTasks, [props.pList._id]: tmpTasks[props.pList._id]}))
      props.ploadTasks();
    } catch (error) {
      console.log(error)
    }

    // getAllListTasks();
    newTaskTitleRef.current.value = "";

  }

  return (
    <Draggable draggableId={props.pList._id} index={props.pIndex} key={props.pList._id}>
      {provided =>
        <Stack minWidth="280px" maxWidth="280px" p={1.5} height="8-px" bgcolor="darkgray" sx={{ alignItems: "center", borderRadius: "0.5em" }} {...provided.draggableProps} ref={provided.innerRef}>

          <Stack direction={"row"} sx={{ width: "100%", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
            {/* <Typography>
          {reduxProjectTest}
        </Typography> */}
          <Box sx={{flex: 1}} {...provided.dragHandleProps}>

            <Typography variant='h6' >
              {props.pList.title}
            </Typography>
          </Box>
            <Box>
              <InfoOutlined onClick={handleListInfo} fontSize="small" />
              <DeleteForeverOutlined size="small" onClick={() => { props.pHandleListDelete(props.pList.shortID) }} />
              <MoreHorizOutlined fontSize="small" />
            </Box>
          </Stack>


          <Droppable droppableId={props.pList._id} type={"task"}>
            {provided => (
              <Stack px={1.5} sx={{ alignItems: "center", py: 2, gap:1, maxHeight: "68vh", overflow: "auto", overflowX: "hidden", width: "240px", maxWidth: "240px" }} ref={provided.innerRef} {...provided.droppableProps}>
                {/* {provided.placeholder} */}
                {
                  // reduxProjectTasks[props.pList._id]?.map((task, index) => {
                  reduxProjectTasks[props.pList._id]?.map((task, index) => {
                    return (
                      <TaskComp pIndex={index} key={task._id} pTask={task} pProjectShortID={props.pProjectShortID} pListID={props.pList._id} pTaskID={task._id} pTaskTitle={task.title} />
                    )
                  })
                }
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
          <Stack>
            <TextField inputRef={newTaskTitleRef} onKeyDown={(e) => { if (e.key === 'Enter') handleNewTask(); }} size='small' />
            <Button onClick={handleNewTask} >Add task</Button>
          </Stack>
        </Stack>
      }
    </Draggable>
  )
}
