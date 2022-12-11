import React from 'react';
import { Link as LinkR } from 'react-router-dom';
import { Box, Card, IconButton, Stack, Typography } from '@mui/material';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateOpenProjectName, updateSnackbar} from '../redux/projectsSlice'

import { SettingsOutlined, ChatBubbleOutlineOutlined, DeleteForeverOutlined } from '@mui/icons-material';

import axios from 'axios'
import { deleteProject } from '../services/ProjectServices';

export default function ProjectSummary(props) {

    const dispatch = useDispatch();

    const aaa = { width: "100%", height: "20%", px: 4, gap: 1, };
    let currentToken = useSelector((state) => state.accessToken)
    const {openProjectName} = useSelector((state) => state.projects);

    const handelProjectDelete = async() => {
        let res = await deleteProject(props.pProjectShortId, props.membership, localStorage.getItem('token'));
        dispatch(updateSnackbar({isOpen: true, msg: res.msg, sev: res.sev}));
        props.deleteFromItem();

        // const url = 'http://127.0.0.1:4000/projects/'+ props.pProjectShortID;
        // const config = {
            // headers: { authtoken: localStorage.getItem('token'), membership: props.membership }
        // }
        
        // let response = await axios.delete(url, config).then(response => response);
        
    }


    return (
        <Card elevation={3} sx={{ display: "flex", minHeight: "150px", width: "70%", my: 3, py: 1 }}>
            {/* <img src='../assets/people/0.jpg' /> */}
            <Box  sx={{ width: "35%", backgroundImage: `url(${props.pBG})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", }} alt="aaaa" src='../assets/people/0.jpg' border={1} mx={1} />
            <Stack flex={1} padding={1}>
                <Stack height="80%">
                    <LinkR style={{textDecoration: "none", color:"black", fontWeight: "bold"}} state={{ projectName: props?.pProjectName}} to={"/p/"+props?.pProjectShortId+ "/" + props?.pProjectName?.replace(/\s+/g, '_')} onClick={ () => {dispatch(updateOpenProjectName(props.pProjectName)) }}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                            {props?.pProjectName}
                        </Typography>
                    </LinkR>
                    <Typography variant='body2'>
                        {props?.pProjectDescription}
                    </Typography>
                    {/* <Typography>
                        {props?.pProjectShortID}
                    </Typography> */}
                </Stack>
                <Stack direction="row" justifyContent={"end"} sx={aaa}>
                    {/* <IconButton sx={{ "&:hover": { color: "inherit" } }}>
                        <SettingsOutlined fontSize="large" />
                    </IconButton> */}
                    {/* <IconButton sx={{ "&:hover": { color: "inherit" } }}>
                        <ChatBubbleOutlineOutlined fontSize="large" />
                    </IconButton> */}
                    <IconButton sx={{ "&:hover": { color: "inherit" }, display: props.membership !== "owner"? "none": "inline" } } onClick={handelProjectDelete}>
                        <DeleteForeverOutlined fontSize="large" />
                    </IconButton>

                </Stack>
            </Stack>
        </Card>
    )
}
