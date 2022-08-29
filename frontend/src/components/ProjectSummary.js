import React from 'react';
import { Link as LinkR } from 'react-router-dom';
import { Box, Card, IconButton, Stack, Typography } from '@mui/material';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { SettingsOutlined, ChatBubbleOutlineOutlined, DeleteForeverOutlined } from '@mui/icons-material';

import axios from 'axios'

export default function ProjectSummary(props) {

    const dispatch = useDispatch();

    const aaa = { width: "100%", height: "20%", px: 4, gap: 1, };
    let currentToken = useSelector((state) => state.accessToken)
    const currentProjectName = useSelector((state) => state.currentProjectName);

    const handelProjectDelete = () => {
        const url = 'http://127.0.0.1:4000/projects/del/'+ props.pProjectShortID;
        const config = {
            headers: { authtoken: currentToken }
        }

        axios.delete(url, config);
    }

    return (
        <Card elevation={3} sx={{ display: "flex", minHeight: "200px", width: "70%", my: 3, py: 1 }}>
            {/* <img src='../assets/people/0.jpg' /> */}
            <Box component="img" sx={{ width: "35%" }} alt="aaaa" src='../assets/people/0.jpg' border={1} mx={1} />
            <Stack flex={1} padding={1}>
                <Stack height="80%">
                    <LinkR state={{ projectName: props.pProjectName}} to={"/p/"+props.pProjectShortID+ "/" + props.pProjectName.replace(/\s+/g, '')} onClick={ () => {dispatch({type: "updateCurrentProjectName", payload: props.pProjectName}) }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                            {props.pProjectName}
                        </Typography>
                    </LinkR>
                    <Typography variant='body2'>
                        {props.pProjectDescription}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent={"end"} sx={aaa}>
                    <IconButton sx={{ "&:hover": { color: "inherit" } }}>
                        <SettingsOutlined fontSize="large" />
                    </IconButton>
                    <IconButton sx={{ "&:hover": { color: "inherit" } }}>
                        <ChatBubbleOutlineOutlined fontSize="large" />
                    </IconButton>
                    <IconButton sx={{ "&:hover": { color: "inherit" } }} onClick={handelProjectDelete}>
                        <DeleteForeverOutlined fontSize="large" />
                    </IconButton>

                </Stack>
            </Stack>
        </Card>
    )
}
