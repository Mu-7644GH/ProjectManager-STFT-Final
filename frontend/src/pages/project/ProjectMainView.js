import React, { useRef } from 'react'
import { useEffect, useState, } from 'react'
import { useParams } from 'react-router-dom';

import List from './List'
import axios from 'axios';
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import SimpleSnackbar from '../../components/SimpleSnackbar';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { updateLists, updateTasks, returnLists, reorderTasks, removeTask, addTask, updateTest, updateSnackbar, } from '../../redux/projectsSlice';

import { Button, TextField, Typography, Stack, Divider, Skeleton, Card } from '@mui/material'
import Box from '@mui/material/Box'
import { createNewList_post, deleteList, updateListsOrder_put, updateTasksOrder_put } from '../../services/ProjectServices';



export default function ProjectMainView(props) {
  // window.alert("start projectMainview");

  let { shortid: projectShortIdParam } = useParams();
  const newListTitleRef = useRef();
  // const testInputRef = useRef();
  // const nanoid = newNanoID(10);

  // const location = useLocation()
  const dispatch = useDispatch();

  const { accessToken: reduxAccessToken, roles: reduxUserRoles } = useSelector((state) => state.user);
  const { lists: reduxProjectLists } = useSelector((state) => state.projects);
  const { tasks: reduxProjectTasks } = useSelector((state) => state.projects);
  const { openProjectData: reduxOpenProjectData } = useSelector((state) => state.projects);

  const [lists, setLists] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  const getAllProjectLists = async () => {

    let url = 'http://127.0.0.1:4000/projects/lists/getall/' + projectShortIdParam;
    const config = {
      // headers: { authtoken: reduxAccessToken }
      headers: { authtoken: localStorage.getItem('token') }
    }

    let response = await axios.get(url, config).then((response) => response);
    if (response.data.status) {
      // console.log(" getAllProjectLists: ");
      // console.log(response.data.msg);
      // console.log(response.data.data);
      // console.log(reduxProjectLists);

      dispatch(updateLists(response.data.data));
      setIsLoading(false);
    } else {
      // setLists([]);
      console.log(response.data);
      dispatch(updateLists([]));
    }
  }

  useEffect(() => {
    // if (reduxOpenProjectData?.bg) {
    //   localStorage.setItem('bg', reduxOpenProjectData.bg)
    // }
    getAllProjectLists();
  }, []);


  const infoClickLocal = () => {
    // console.log("project name:" + projectShortIdParam)
    // console.log(reduxProjectLists.length)
    // console.log(reduxOpenProjectData.bg)
    getAllListTasks();
  }

  const createNewList = async () => {

    let ttl = newListTitleRef.current.value;
    if (ttl.replace(/\s/g, '').length === 0) {
      dispatch(updateSnackbar({ isOpen: true, msg: "Please enter List title", sev: "error" }));
      return;
    }

    let res = await createNewList_post(ttl, projectShortIdParam, reduxAccessToken);

    if (res.status === 1) {
      getAllProjectLists();
      newListTitleRef.current.value = "";
      dispatch(updateSnackbar({ isOpen: true, msg: res.msg, sev: res.sev }));
    } else if (res.data.status === -1) {
      dispatch(updateSnackbar({ isOpen: true, msg: res.msg, sev: res.sev }));
    }
  }

  const handleListDelete = async (_listId) => {
    let res = await deleteList(_listId, projectShortIdParam, reduxAccessToken);
    getAllProjectLists();
  }

  const getListTasks = async (_listId) => {
    let url = 'http://127.0.0.1:4000/tasks/getonelist/' + projectShortIdParam + '/' + _listId;
    const config = {
      headers: { authtoken: localStorage.getItem('token') }
    }

    try {
      let response = await axios.get(url, config).then((response) => response);
      console.log(response.data.data)
      // let obj = {[_listId] : [...response.data.data]};
      return response.data.data;

      // dispatch(updateTasks({ ...reduxProjectTasks, [_listId]: response.data.data }))
      // console.log("redux tasks: ")
      // console.log(reduxProjectTasks)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllListTasks = async () => {
    console.log("running on tasks!!")
    // console.log(reduxProjectLists)
    let obj = {};

    for (let x = 0; x < reduxProjectLists.length; x++) {
      let tl = await getListTasks(reduxProjectLists[x]._id);
      obj[reduxProjectLists[x]._id] = await tl;
    }

    // console.log(obj)
    dispatch(updateTasks(obj));
    // setIsLoading(false);
  }

  ///////////////////////////////////

  const onDragEnd = async (result) => {
    const { destination, source, draggeableId, type } = result;

    // console.log("hello!! drag");
    // console.log(type);
    // console.log(source.droppableId);
    // console.log(destination.droppableId);
    // console.log(draggeableId);


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
      await updateListsOrder(source.index, destination.index, newListsOrder);
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


    // window.alert(type + "\n" + source.index + "\n" + source.droppableId + "\n" + destination.index + "\n" + destination.droppableId + "\n" + draggeableId + "\n" + GID);

    if (source.droppableId === destination.droppableId) {

      try {
        // console.log(nweSourceTasksList);

        nweSourceTasksList.splice(source.index, 1);
        nweSourceTasksList.splice(destination.index, 0, GID);
        dispatch(reorderTasks({ type: "taskIds-source", listIndex: SLI, tasks: nweSourceTasksList }));

        let slicedTasks = newSourceTasks.splice(source.index, 1)
        newSourceTasks.splice(destination.index, 0, slicedTasks[0])
        dispatch(reorderTasks({ type: "tasks-source", listId: source.droppableId, data: newSourceTasks }));

        await updateTasksOrder(source.droppableId, nweSourceTasksList, SLI);
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
      // dispatch(reorderTasks({ type: "taskIds-source-dest", sli: SLI, stl: nweSourceTasksList, dli: DLI, dtl: nweDestTasksList }));

      let slicedTasks = newSourceTasks.splice(source.index, 1)
      // win
      newDestTasks.splice(destination.index, 0, slicedTasks[0])
      dispatch(reorderTasks({ type: "tasks-source", listId: source.droppableId, data: newSourceTasks }));
      dispatch(reorderTasks({ type: "tasks-dest", listId: destination.droppableId, data: newDestTasks }));

      await updateTasksOrder(source.droppableId, nweSourceTasksList, SLI);
      await updateTasksOrder(destination.droppableId, nweDestTasksList, DLI);
      // dispatch(updateTasks());
      // return;
    } catch (error) {
      return console.log(error);
    }

  }

  const updateListsOrder = async (_si, _di, _lists) => {
    let res = await updateListsOrder_put(_si, _di, _lists, projectShortIdParam, reduxAccessToken);
    console.log(res.msg);
    dispatch(updateSnackbar({ isOpen: true, msg: res?.msg, sev: res?.sev }));
  }

  const updateTasksOrder = async (_listId, _tasks, _index) => {
    let res = await updateTasksOrder_put(_listId, _tasks, _index, projectShortIdParam, reduxAccessToken);
    console.log(res.msg);
    dispatch(updateSnackbar({ isOpen: true, msg: res?.msg, sev: res?.sev }));
  }


  return (
    <Box flex={1} px={3.5} border={1} sx={{ backgroundImage: `url(${reduxOpenProjectData?.bg})`, backgroundPosition: "center", backgroundSize: "100% auto", backgroundRepeat: "no-repeat", }} >
      {isLoading
        ? <Box display={"flex"} py={3} px={4} gap={4} maxHeight={"90%"} minHeight={"90%"}>
          {/* <Typography variant='h3' > LOADING.... </Typography> */}
          {

            reduxOpenProjectData?.lists?.map(() => {
              return (

                <Skeleton variant='rectangular' width={280} height={500} />
              )
            })
          }
          {/* <Skeleton variant='rectangular' width={280} height={500}  />  */}
          {/* <Skeleton variant='rectangular' width={280} height={500} />  */}
        </Box>
        :
        <>
          {/* <Button onClick={infoClickLocal}>{projectShortIdParam}</Button> */}
          <DragDropContext onDragEnd={onDragEnd}>
            {/* sx={{ overflow: "auto", overflowY: "hidden" }} */}
            <Droppable droppableId="all-lists" direction="horizontal" type="list">
              {provided =>
                  <Stack direction={"row"} py={3} px={4} gap={4} maxHeight={"90%"} minHeight={"90%"} sx={{ overflow: "auto", overflowY: "hidden" }} {...provided.droppableProps} ref={provided.innerRef}>
                    {

                      reduxProjectLists?.map((list, index) => {

                        return (
                          <List key={list._id} pIndex={index} pList={list} pHandleListDelete={handleListDelete} pProjectShortID={projectShortIdParam} getAllListTasks={getAllListTasks} />
                        )
                      })
                    }
                    {provided.placeholder}
                    <Divider orientation="vertical" flexItem={true} />
                    <Card sx={{height: "90px", opacity: "88%", px: 1, py: 1.5, display: reduxUserRoles.owner || reduxUserRoles.admin ? "block" : "none"}} >
                      <Stack minWidth="150px">

                        <TextField inputRef={newListTitleRef} size='small' onKeyDown={(e) => { if (e.key === 'Enter') createNewList(); }} type="text" autoComplete='false' />
                        {/* <TextField inputRef={testNameRef} size='small' onKeyDown={(e) => { if (e.key === 'Enter') setTestName(); }} /> */}
                        <Button onClick={createNewList} >Add new List</Button>
                      </Stack>
                    </Card>
                  </Stack>
                }
              </Droppable>
            </DragDropContext>
          </>
      }
      {/* <SimpleSnackbar isOpen={isSnackBarOpen} setIsOpen={setIsSnackBarOpen} /> */}
      <SimpleSnackbar />
    </Box >
  )
}
