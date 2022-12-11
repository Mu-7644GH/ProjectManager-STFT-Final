import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link as LinkR, Navigate, Outlet } from 'react-router-dom';

import { Typography, Breadcrumbs, Stack, Box } from '@mui/material';

import ProjectMainView from './ProjectMainView'
import ProjectChatView from './ProjectChatView'
import ProjectOverView from './ProjectOverView'
import ProjectSettingsView from './ProjectSettingsView'

import { useSelector, useDispatch } from 'react-redux';
import { updateLists, updateTasks, updateOpenProjectData, updateThemeColor, updateProjectThemeColor, updateSnackbar } from '../../redux/projectsSlice';
import { updateIsUserLoggedIn, updateUserRoles, updateUsername, updateUserShortId, updateAccessToken } from '../../redux/userSlice';

import axios from 'axios';
import { getOpenProjectData, loadUserProjectRoles } from '../../services/ProjectServices'



export default function Project(props) {


    const { themeColor: reduxThemeColor, openProjectName: reduxOpenProjectName, openProjectData: reduxOpenProjectData } = useSelector((state) => state.projects);
    const { accessToken: reduxAccessToken, roles: reduxUserRoles, isUserLoggedIn: reduxIsUserLoggedIn } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const { shortid: projectShortId, projectname } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const homePath = location.pathname;
    const projectName2 = reduxOpenProjectData?.name;

    const [isLoading, setIsLoading] = useState(true);
    const [mainMsg, setMainMsg] = useState("Loading project...");

    const loadLocal = async () => {
        if (reduxIsUserLoggedIn) {

            dispatch(updateUsername(localStorage.getItem('un')))
            dispatch(updateUserShortId(localStorage.getItem('sid')))
            dispatch(updateAccessToken(localStorage.getItem('token')))
        }

    }

    const getAPi = async () => {
        setIsLoading(true);

        try {
            setIsLoading(true);
            let opd = await getOpenProjectData(reduxAccessToken, projectShortId);
            if (opd?.tokenNeeded === false) {
                // console.log("token is not needed.")
                // dispatch(updateSnackbar({isOpen: true, msg: "token is not needed", sev:"info"}));
                dispatch(updateOpenProjectData(opd?.data));
                setIsLoading(false);
                if (reduxIsUserLoggedIn) {
                    let rolesObj = await loadUserProjectRoles(reduxAccessToken, projectShortId);
                    dispatch(updateUserRoles(rolesObj));
                    // setIsLoading(false);
                    // let opd = await getOpenProjectData(reduxAccessToken, projectShortId);
                    // dispatch(updateOpenProjectData(opd?.data));
                    // setIsLoading(false);
                    return;
                }
                return;
            }
            if (reduxIsUserLoggedIn) {
                let rolesObj = await loadUserProjectRoles(reduxAccessToken, projectShortId);
                dispatch(updateUserRoles(rolesObj));
                setIsLoading(false);
                // let opd = await getOpenProjectData(reduxAccessToken, projectShortId);
                // dispatch(updateOpenProjectData(opd?.data));
                // setIsLoading(false);
                return;
            }
            // window.alert("project is pulic!" + opd?.msg)

            // setMainMsg("404, proect is not public.")

 
            // let opd = await getOpenProjectData(reduxAccessToken, projectShortId);
            // dispatch(updateProjectThemeColor(opd?.data?.themeColor));
            // if (res.locals?.isTokenNeeded == false) {
            //     dispatch(updateOpenProjectData(opd?.data));
            // }
            // console.log(opd?.data?.msg);
            // if (opd?.tokenNeeeded === false) {
            //     console.log("token is not needed.")
            //     dispatch(updateSnackbar({isOpen: true, msg: "token is not needed", sev:"info"}));
            //     dispatch(updateOpenProjectData(opd?.data));
            //     setIsLoading(false);
            //     return;
            // }

        } catch (error) {
            console.log(error);
        }




        // getAllProjectLists();
    }

    useEffect(() => {
        loadLocal();
        getAPi();
    }, [])

    const getAllProjectLists = async () => {

        let url = 'http://127.0.0.1:4000/projects/lists/getall/' + projectShortId;
        const config = {
            headers: { authtoken: reduxAccessToken }
        }

        let response = await axios.get(url, config).then((response) => response);
        if (response.data.status) {
            console.log(" getAllProjectLists: ");
            console.log(response.data);

            dispatch(updateLists(response.data.data));
            setIsLoading(false)
        } else {
            // setLists([]);
            dispatch(updateLists([]));

        }

    }

    const getAllProjectTasks = async () => {
        let url = 'http://127.0.0.1:4000/tasks/getall/' + projectShortId;
        const config = {
            headers: { authtoken: reduxAccessToken }
        }

        try {
            let response = await axios.get(url, config).then((response) => response);
            console.log(response.data.data)
            return response.data.data;
            // setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    let style_project = (location.pathname == `/p/${projectShortId}/${projectName2?.replace(/\s+/g, '_')}`)
        ? {
            color: "darkgray",
            textDecoration: "underline"
        }
        : {
            color: "black",
            textDecoration: "none"
        };
    let style_overview = (location.pathname == `/p/${projectShortId}/${projectName2?.replace(/\s+/g, '_')}/ov`)
        ? {
            color: "darkgray",
            textDecoration: "underline"
        }
        : {
            color: "black",
            textDecoration: "none"
        };
    let style_chat = (location.pathname == `/p/${projectShortId}/${projectName2?.replace(/\s+/g, '_')}/cht`)
        ? {
            color: "darkgray",
            textDecoration: "underline"
        }
        : {
            color: "black",
            textDecoration: "none"
        };
    let style_settings = (location.pathname == `/p/${projectShortId}/${projectName2?.replace(/\s+/g, '_')}/stngs`)
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
            {/* {window.alert("start projectLayout render...")} */}
            <Box display="flex" justifyContent="center" alignItems={"center"} sx={{ bgcolor: `${reduxOpenProjectData?.themeColor}.light`, opacity: "70%", color: "white" }} >
                <Typography variant="h5" component="h3" alignSelf="center" sx={{ pl: 4 }}>{reduxOpenProjectData?.name}</Typography>
                <Breadcrumbs aria-label="breadcrumb" sx={{ display: "flex", justifyContent: "center", height: "2em", flex: 1, }}>
                    <NavLink to={`/p/${projectShortId}/${reduxOpenProjectData?.name?.replace(/\s+/g, '_')}`} style={style_project}>
                        <Typography>
                            Mainview
                        </Typography>
                    </NavLink>
                    {/* <NavLink underline="hover" color="inherit" to={`/p/${projectShortId}/${projectname}/ov`} style={style_overview}>
                        <Typography>
                            Overview
                        </Typography>
                    </NavLink> */}
                    {/* <NavLink underline="hover" color="inherit" to={`/p/${projectShortId}/${projectname}/cht`} style={style_chat}>
                        <Typography>
                            Chat
                        </Typography>
                    </NavLink> */}
                    <NavLink underline="hover" color="inherit" to={`/p/${projectShortId}/${reduxOpenProjectData.name?.replace(/\s+/g, '_')}/stngs`} style={style_settings} >
                        <Typography>
                            Settings
                        </Typography>
                    </NavLink>
                </Breadcrumbs>
            </Box>
            {isLoading ? <Typography>{mainMsg}</Typography> :
                reduxOpenProjectData.isPublic ?
                    <Outlet />
                    :
                    reduxUserRoles.owner || reduxUserRoles.admin || reduxUserRoles.user ?
                        <Outlet />
                        :
                        <Box textAlign="center" height="50%">
                            <Typography variant='h3'>you have no access</Typography>
                        </Box>
            }


        </Box >
    )
}
