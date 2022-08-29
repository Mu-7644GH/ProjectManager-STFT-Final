import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link as LinkR, Navigate, Outlet } from 'react-router-dom';

import { Typography, Breadcrumbs, Stack, Box } from '@mui/material';

import ProjectMainView from './ProjectMainView'
import ProjectChatView from './ProjectChatView'
import ProjectOverView from './ProjectOverView'
import ProjectSettingsView from './ProjectSettingsView'

import { useSelector, useDispatch } from 'react-redux';
import { updateLists, updateTasks, returnLists, reorderTasks, removeTask, addTask, updateTest,  } from '../../redux/projectsSlice';

import axios from 'axios';



export default function Project(props) {

    const { openProjectName :reduxOpenProjectName} = useSelector((state) => state.projects);
    const {accessToken : reduxAccessToken} = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const { shortid, projectname } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const homePath = location.pathname;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // getAllProjectLists();
        // getAllProjectTasks();
    }, [])

    const getAllProjectLists = async () => {

        let url = 'http://127.0.0.1:4000/projects/lists/getall/' + shortid;
        const config = {
          headers: { authtoken: reduxAccessToken }
        }
    
        let response = await axios.get(url, config).then((response) => response);
        if (response.data.status) {
          console.log(" getAllProjectLists: ");
          console.log(response.data);
    
          dispatch(updateLists(response.data.data));
          
        } else {
          // setLists([]);
          dispatch(updateLists([]));
          
        }
    
      }

      const getAllProjectTasks = async() => {
        let url = 'http://127.0.0.1:4000/tasks/getall/' + shortid ;
        const config = {
          headers: { authtoken: reduxAccessToken }
        }
    
        try {
          let response = await axios.get(url, config).then((response) => response);
          console.log(response.data.data)
          return response.data.data;
    
        } catch (error) {
          console.log(error)
        }
      }


    let style_project = (location.pathname == `/p/${shortid}/${projectname}`)
        ? {
            color: "darkgray",
            textDecoration: "underline"
        }
        : {
            color: "black",
            textDecoration: "none"
        };
    let style_overview = (location.pathname == `/p/${shortid}/${projectname}/ov`)
        ? {
            color: "darkgray",
            textDecoration: "underline"
        }
        : {
            color: "black",
            textDecoration: "none"
        };
    let style_chat = (location.pathname == `/p/${shortid}/${projectname}/cht`)
        ? {
            color: "darkgray",
            textDecoration: "underline"
        }
        : {
            color: "black",
            textDecoration: "none"
        };
    let style_settings = (location.pathname == `/p/${shortid}/${projectname}/stngs`)
        ? {
            color: "darkgray",
            textDecoration: "underline"
        }
        : {
            color: "black",
            textDecoration: "none"
        };


    return (
        <Box flex={1} display="flex" flexDirection={"column"} border={2}>
            <Box display="flex" justifyContent="center">
                <Typography variant="h5" component="h3" alignSelf="center" sx={{ pl: 4 }}>{reduxOpenProjectName}</Typography>
                <Breadcrumbs aria-label="breadcrumb" sx={{ display: "flex", justifyContent: "center", height: "3em", flex: 1 }}>
                    <NavLink to={`/p/${shortid}/${projectname}`} style={style_project}>
                        <Typography>
                            Mainview
                        </Typography>
                    </NavLink>
                    <NavLink underline="hover" color="inherit" to={`/p/${shortid}/${projectname}/ov`} style={style_overview}>
                        <Typography>
                            Overview
                        </Typography>
                    </NavLink>
                    <NavLink underline="hover" color="inherit" to={`/p/${shortid}/${projectname}/cht`} style={style_chat}>
                        <Typography>
                            Chat
                        </Typography>
                    </NavLink>
                    <NavLink underline="hover" color="inherit" to={`/p/${shortid}/${projectname}/stngs`} style={style_settings} >
                        <Typography>
                            Settings
                        </Typography>
                    </NavLink>
                </Breadcrumbs>
            </Box>
            <Outlet />
        </Box >
    )
}
