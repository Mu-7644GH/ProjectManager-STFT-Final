import React, { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { updateAccessToken, updateUserShortId, updateUsername, updateIsUserLoggedIn, updateUserProjectsList } from '../redux/userSlice';

//ui
import { Box, Button, TextField, Typography, Card, Input, FormLabel, Stack, Grid, FormGroup, FormControl, Alert } from '@mui/material';
import { Container } from '@mui/system';
import { nanoid } from 'nanoid';
import { getOpenProjectData, getUserProjectsLists, loadUserProjectRoles } from '../services/ProjectServices'


function Homepage() {
    let dispatch = useDispatch();
    // let currentUsername = useSelector((state) => state.username);
    const [isLoading, setIsLoading] = useState(true);
    const { isUserLoggedIn: reduxIsUserLoggedIn, accessToken: reduxAccessToken } = useSelector((state) => state.user)
    const { userProjectsList: reduxUserProjectsList } = useSelector((state) => state.user)
    // let currentUserID = useSelector((state) => state.userShortID);

    const [alertObj, setAlertObj] = useState({ msg: "hello", severity: "error", visibility: "hidden" });

    const emailInputRef = useRef();
    const passInputRef = useRef();
    const navigate = useNavigate();


    useEffect(() => {
        // console.log("home loaded...");
    }, [])

    // getUserProjectsLists(localStorage.getItem('token'))

    const getUserProjects = async () => {
        const url = 'http://127.0.0.1:4000/projects/getall';
        const config = {
            // headers: { authtoken: currentToken }
            headers: { authtoken: reduxAccessToken }
        }

        await axios.get(url, config).then(function (response) {
            if (response.data.status) {

                // console.log("response projects list: ");
                // console.log(response.data)

                // dispatch({ type: "updateUserProjectsData", payload: response.data.data3 });
                dispatch(updateUserProjectsList(response.data.data3));
                // return;
                // setIsLoaded(true)
            } else {
                // dispatch({ type: "updateUserProjectsData", payload: [] });
                dispatch(updateUserProjectsList([]));
                // setIsLoaded(true)
            }

            // console.log(response.data);
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    // const doApi = async() => {
    //     let opd = await getOpenProjectData(reduxAccessToken, projectShortId);
    //     dispatch(updateThemeColor(opd?.themeColor));
    //     dispatch(updateOpenProjectData(opd));

    //     let rolesObj = await loadUserProjectRoles(reduxAccessToken, projectShortId);
    //     dispatch(updateUserRoles(rolesObj));
    // }

    // const getAllProjectLists = async () => {

    //     let url = 'http://127.0.0.1:4000/projects/lists/getall/' + projectShortId;
    //     const config = {
    //         headers: { authtoken: reduxAccessToken }
    //     }

    //     let response = await axios.get(url, config).then((response) => response);
    //     if (response.data.status) {
    //         console.log(" getAllProjectLists: ");
    //         console.log(response.data);

    //         dispatch(updateLists(response.data.data));
    //         setIsLoading(false)
    //     } else {
    //         // setLists([]);
    //         dispatch(updateLists([]));

    //     }

    // }

    const onSubmit = async (e) => {
        e.preventDefault();

        const url = 'http://127.0.0.1:4000/login';
        const data = {
            email: emailInputRef.current.value,
            password: passInputRef.current.value,
        };
        let response = await axios.post(url, data)
        if (response.data.status) {
            localStorage.setItem('un', response.data.username);
            localStorage.setItem('sid', response.data.shortId);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isLogged', true);

            dispatch(updateAccessToken(response.data.token));
            dispatch(updateIsUserLoggedIn(true));
            dispatch(updateUsername(response.data.username));
            dispatch(updateUserShortId(response.data.shortId));

            navigate("/u/" + response.data.shortId + "/home")
        } else {
            console.log(response.data.status);

            setAlertObj({ ...alertObj, msg: response.data.message, visibility: "visible" });
        }
    }


    return (
        <Container >

            <Stack bgcolor={{ xs: "red", sm: "orange", md: "yellow", lg: "#c5cae9" }} direction={{ sm: "column", md: "row" }} justifyContent='flex-end' alignItems="center" minHeight="100vh" >
                <Box direction='column' width={{ xs: "100%", md: "50%" }} height="60%" px={4} my={3}>
                    <Typography variant='h3'>
                        Projetcs Hub.
                    </Typography>
                    create mangage and Projects with your peers.
                    <Typography my={2}>
                    </Typography>
                </Box>
                <Box display='flex' justifyContent='center' width={{ xs: "100%", md: "50%" }} height="70%" >
                    <Card elevation={5} sx={{ overflow: "hidden", width: { xs: "85%", sm: "80%" }, maxWidth: { sm: "400px" }, my: { xs: 4 }, py: 10, display: "flex", justifyContent: "center" }} >
                        <FormControl sx={{ textAlign: "center" }} >
                            <Typography variant="h4" component="h2"> Lgin now</Typography>
                            <FormGroup >
                                <TextField inputRef={emailInputRef} variant="outlined" label="email" size="small" margin="dense" />
                            </FormGroup>
                            <FormGroup >
                                <TextField type="password" inputRef={passInputRef} variant="outlined" label="password" size="small" margin="dense" />
                            </FormGroup>
                            <Button variant='contained' sx={{ mt: "8px" }} onClick={onSubmit}>login</Button>
                            <Link to="/signup" sx={{ mt: "8px" }}>Not registered? cick here to signup.</Link>
                            <Alert variant="outlined" severity={alertObj.severity} sx={{ mb: 0, mt: 4, mx: 2, visibility: alertObj.visibility }} >
                                {alertObj.msg}
                            </Alert>
                        </FormControl>

                    </Card>
                </Box>
            </Stack>

            <Box height='100vh' border={5} borderColor={'secondary'}>
                <Typography variant='h3'>
                    Manage!
                </Typography>
                <Typography>
                    Mangae the project team and the project's objectives.
                </Typography>

                <Link to={'/Login'}>
                    <button>learn more</button>
                </Link>
            </Box>

            <Box height='100vh' border={2} borderColor='error.main'>
                <Typography variant='h3'>
                    Share!
                </Typography>
                <Typography>
                    Share and discover what other people are working on.
                </Typography>

                <Link to={'/Login'}>
                    <button>learn more</button>
                </Link>
            </Box>
        </Container >
    )
}

export default Homepage