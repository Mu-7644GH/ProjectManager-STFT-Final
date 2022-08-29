import React, {useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { updateAccessToken, updateUserShortId, updateUsername, updateIsUserLoggedIn } from '../redux/userSlice';

//ui
import { Box, Button, TextField, Typography, Card, Input, FormLabel, Stack, Grid, FormGroup, FormControl, Alert } from '@mui/material';
import { Container } from '@mui/system';
import { nanoid } from 'nanoid';


function Homepage() {
    let dispatch = useDispatch();
    // let currentUsername = useSelector((state) => state.username);
    // const {isUserLoggedIn : reduxIsUserLoggedIn} = useSelector((state) => state.user)

    // let currentUserID = useSelector((state) => state.userShortID);

    const [alertObj, setAlertObj] = useState({ msg: "hello", severity: "error", visibility: "hidden" });

    const emailInputRef = useRef();
    const passInputRef = useRef();
    const navigate = useNavigate();


    useEffect(() => {
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();

        const url = 'http://127.0.0.1:4000/login';
        const data = {
            email: emailInputRef.current.value,
            password: passInputRef.current.value,
        };
        axios.post(url, data).then(function (response) {
            if (response.data.status) {
                dispatch(updateAccessToken(response.data.token))
                dispatch(updateIsUserLoggedIn(true))
                dispatch(updateUsername(response.data.username))
                dispatch(updateUserShortId(response.data.shortID))

                // dispatch({ type: "updateAccessToken", payload: response.data.token })
                // dispatch({ type: "updateIsUserLoggedIn", payload: true });
                // dispatch({ type: "updateUsername", payload: response.data.username })
                // dispatch({ type: "updateUserShortID", payload: response.data.shortID })

                localStorage.setItem('un', response.data.username );
                localStorage.setItem('token', response.data.token );
                localStorage.setItem('isLogged', true );

                navigate("/u/"+response.data.shortID+"/home")
            } else {
                console.log(response.data.status);

                setAlertObj({ ...alertObj, msg: response.data.message,visibility: "visible" });
            }
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <Container >

            <Stack bgcolor={{ xs: "red", sm: "orange", md: "yellow", lg: "#c5cae9" }} direction={{ sm: "column", md: "row" }} justifyContent='flex-end' alignItems="center" minHeight="100vh" >
                <Box direction='column' width={{ xs: "100%", md: "50%" }} height="60%" px={4} my={3}>
                    <Typography variant='h3'>
                        Home page
                    </Typography>
                    <Typography my={2}>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
                    </Typography>
                </Box>
                <Box display='flex' justifyContent='center' width={{ xs: "100%", md: "50%" }} height="70%" >
                    <Card elevation={5} sx={{ overflow: "hidden", width: { xs: "85%", sm: "80%" }, maxWidth: {sm: "400px"}, my: { xs: 4 }, py: 10, display: "flex", justifyContent: "center" }} >
                        <FormControl sx={{ textAlign: "center" }} >
                            <Typography variant="h4" component="h2"> Lgin now</Typography>
                            <FormGroup >
                                <TextField inputRef={emailInputRef} variant="outlined" label="email" size="small" margin="dense" />
                            </FormGroup>
                            <FormGroup >
                                <TextField type="password" inputRef={passInputRef} variant="outlined" label="password" size="small" margin="dense" />
                            </FormGroup>
                            <Button variant='contained' sx={{ mt: "8px" }} onClick={onSubmit}>login</Button>
                            <Link to="/login" sx={{ mt: "8px" }}>Not registered? cick here to signup.</Link>
                            <Alert variant="outlined" severity={alertObj.severity} sx={{ mb: 0, mt: 4, mx: 2, visibility: alertObj.visibility }} >
                                {alertObj.msg}
                            </Alert>
                        </FormControl>

                    </Card>
                </Box>
            </Stack>

            <Box height='100vh' border={5} borderColor={'secondary'}>
                <Typography variant='h3'>
                    Project managment info!
                </Typography>
                <Typography>
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
                </Typography>

                <Link to={'/Login'}>
                    <button>learn more</button>
                </Link>
            </Box>

            <Box height='100vh' border={2} borderColor='error.main'>
                <Typography variant='h3'>
                    community managment info!
                </Typography>
                <Typography>
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
                </Typography>

                <Link to={'/Login'}>
                    <button>learn more</button>
                </Link>
            </Box>
        </Container >
    )
}

export default Homepage