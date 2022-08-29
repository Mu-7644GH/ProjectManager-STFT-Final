import React, { useRef } from 'react'
import { useEffect, useState, } from 'react'
import { Params, useLocation, useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import List from './List'

//redux
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { newNanoID } from '../../utils/nanoid';

import { Button, TextField, Typography, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import { red } from '@mui/material/colors';
import { updateLists, updateTasks, returnLists, reorderTasks, removeTask, addTask, updateTest, } from '../../redux/projectsSlice';



export default function ProjectMainView(props) {

  let { shortid: projectShortIDParam } = useParams();
  const newListTitleRef = useRef();
  const testInputRef = useRef();
  const nanoid = newNanoID(10);

  const location = useLocation()
  const dispatch = useDispatch();
  // let projectOBJ = useSelector((state) => state.projectData);
  // let currentToken = useSelector((state) => state.accessToken);

  const { accessToken: reduxAccessToken } = useSelector((state) => state.user);
  const { lists: reduxProjectLists } = useSelector((state) => state.projects);
  const { tasks: reduxProjectTasks } = useSelector((state) => state.projects);

  const [lists, setLists] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllProjectLists = async () => {

    let url = 'http://127.0.0.1:4000/projects/lists/getall/' + projectShortIDParam;
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    let response = await axios.get(url, config).then((response) => response);
    if (response.data.status) {
      console.log(" getAllProjectLists: ");
      console.log(response.data);

      dispatch(updateLists(response.data.data));
      setIsLoading(false);
    } else {
      // setLists([]);
      dispatch(updateLists([]));

    }


  }

  useEffect(() => {
    getAllProjectLists();
    setIsLoading(false);
  }, []);



  const infoClickLocal = async () => {
    console.log(reduxProjectTasks)
    getAllListTasks();
  }


  const createNewList = async () => {

    let url = 'http://127.0.0.1:4000/projects/lists/add/' + projectShortIDParam;
    let listID = nanoid(10);
    let data = {
      shortID: listID,
      title: newListTitleRef.current.value,
      isLocked: false,
      tasks: [],
    }
    const config = {
      headers: { authtoken: reduxAccessToken, listNewShortID: listID },
    }

    //localy
    // dispatch({type: "addListToProject",payload: data})

    let response = await axios.post(url, data, config).then((response) => response);
    console.log(response.data.data);
    getAllProjectLists();
    newListTitleRef.current.value = "";
  }

  const handleListDelete = async (_listID) => {
    console.log(_listID);

    const url = 'http://127.0.0.1:4000/projects/' + projectShortIDParam + '/lists/del/' + _listID;
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    await axios.delete(url, config);
    console.log("end of delete");
    getAllProjectLists();
  }

  const getListTasks = async (_listId) => {
    let url = 'http://127.0.0.1:4000/tasks/getall/' + projectShortIDParam + '/' + _listId;
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    try {
      let response = await axios.get(url, config).then((response) => response);
      console.log(response.data.data)
      // let obj = {[_listId] : [...response.data.data]};
      return response.data.data;

      dispatch(updateTasks({ ...reduxProjectTasks, [_listId]: response.data.data }))
      console.log("redux tasks: ")
      console.log(reduxProjectTasks)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllListTasks = async () => {
    let obj = {};

    for (let x = 0; x < reduxProjectLists.length; x++) {
      // let ts = getListTasks(reduxProjectLists[x]._id);
      let tl = await getListTasks(reduxProjectLists[x]._id);
      obj[reduxProjectLists[x]._id] = await tl;
      // obj[reduxProjectLists[x]._id] = ts;
    }

    console.log(obj)
    dispatch(updateTasks(obj));
    setIsLoading(false);
  }
  ///////////////////////////////////

  const onDragEnd = async (result) => {
    const { destination, source, draggeableId, type } = result;

    console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.draggeableId === source.destination &&
      destination.index === source.index
    ) { return }


    if (type === "list") {

      const newListsOrder = [...reduxProjectLists];
      let slicedLists = newListsOrder.splice(source.index, 1);
      console.log("list splice... :");
      console.log(slicedLists);
      newListsOrder.splice(destination.index, 0, slicedLists[0]);

      dispatch(updateLists(newListsOrder));
      await updateListsReorder(source.index, destination.index, newListsOrder);
      await getAllListTasks();
      return;
    }

    let SLI = reduxProjectLists.findIndex(i => i._id == source.droppableId);
    let DLI = reduxProjectLists.findIndex(i => i._id == destination.droppableId);

    let GID = reduxProjectLists[SLI]?.tasks[source.index];

    let nweSourceTasksList = [...reduxProjectLists[SLI].tasks];
    let newSourceTasks = [...reduxProjectTasks[reduxProjectLists[SLI]._id]]

    let nweDestTasksList = [...reduxProjectLists[DLI].tasks];
    let newDestTasks = [...reduxProjectTasks[reduxProjectLists[DLI]._id]]


    if (source.droppableId === destination.droppableId) {

      try {
        // console.log(nweSourceTasksList);

        nweSourceTasksList.splice(source.index, 1);
        nweSourceTasksList.splice(destination.index, 0, GID);
        dispatch(reorderTasks({ type: "taskIds-source", listIndex: SLI, tasks: nweSourceTasksList }));

        let slicedTasks = newSourceTasks.splice(source.index, 1)
        newSourceTasks.splice(destination.index, 0, slicedTasks[0])
        dispatch(reorderTasks({ type: "tasks-source", listId: source.droppableId, data: newSourceTasks }));

        await updateTasksReorder(source.droppableId, nweSourceTasksList, SLI);
        // dispatch(updateTasks());
        // setIsLoading(false);
        return;
      } catch (error) {
        return console.log(error);
      }

    }

    try {

      nweSourceTasksList.splice(source.index, 1);
      nweDestTasksList.splice(destination.index, 0, GID);
      dispatch(reorderTasks({ type: "taskIds-source", listIndex: SLI, tasks: nweSourceTasksList }));
      dispatch(reorderTasks({ type: "taskIds-dest", listIndex: DLI, tasks: nweDestTasksList }));

      let slicedTasks = newSourceTasks.splice(source.index, 1)
      newDestTasks.splice(destination.index, 0, slicedTasks[0])
      dispatch(reorderTasks({ type: "tasks-source", listId: source.droppableId, data: newSourceTasks }));
      dispatch(reorderTasks({ type: "tasks-dest", listId: destination.droppableId, data: newDestTasks }));

      await updateTasksReorder(source.droppableId, nweSourceTasksList, SLI);
      // dispatch(updateTasks());
      return;
    } catch (error) {
      return console.log(error);
    }

  }

  const updateListsReorder = async (_si, _di, _lists) => {
    let url = 'http://127.0.0.1:4000/projects/lists/reorder/' + projectShortIDParam;
    let data = {
      data: _lists,
    }
    const config = {
      headers: { authtoken: reduxAccessToken },
    }

    try {

      let response = await axios.post(url, data, config).then((response) => response);
      console.log("DONE!!!!!!!!!!!!!");
    } catch (error) {
      console.log(error);
    }
  }

  const updateTasksReorder = async (_listID, _tasks, _index) => {

    let url = 'http://127.0.0.1:4000/tasks/reorder/' + projectShortIDParam;
    let data = {
      listID: _listID,
      tasks: _tasks,
      index: _index,
    }
    const config = {
      headers: { authtoken: reduxAccessToken },
    }

    try {

      let response = await axios.post(url, data, config).then((response) => response);
      console.log("DONE!!!!!!!!!!!!!");
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <Box bgcolor="whitesmoke" flex={1} px={4} >
      {isLoading ? <Typography variant='h3'> LOADING.... </Typography> :
        <>
          <Button onClick={infoClickLocal}>Loacal info</Button>
          <DragDropContext onDragEnd={onDragEnd}>
            {/* sx={{ overflow: "auto", overflowY: "hidden" }} */}
            <Droppable droppableId="all-lists" direction="horizontal" type="list">
              {provided =>
                <Stack direction={"row"} py={3} px={4} gap={4} maxHeight={"90%"} minHeight={"90%"} sx={{ overflow: "auto", overflowY: "hidden" }} {...provided.droppableProps} ref={provided.innerRef}>
                  {

                    reduxProjectLists?.map((list, index) => {

                      return (
                          <List Key={list._id} pIndex={index} pList={list} pHandleListDelete={handleListDelete} pProjectShortID={projectShortIDParam} ploadTasks={getAllListTasks} />
                      )
                    })
                  }
                  {provided.placeholder}
            <Stack minWidth="300px">
              <TextField inputRef={newListTitleRef} size='small' onKeyDown={(e) => { if (e.key === 'Enter') createNewList(); }} />
              {/* <TextField inputRef={testNameRef} size='small' onKeyDown={(e) => { if (e.key === 'Enter') setTestName(); }} /> */}
              <Button onClick={createNewList} >Add new List</Button>
            </Stack>
                </Stack>
              }
            </Droppable>
          </DragDropContext>
        </>
      }
    </Box >
  )
}
