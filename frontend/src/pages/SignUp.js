import React from 'react'
import { useState, useRef, useEffect } from 'react';

//other
import axios from 'axios';
import { nanoid } from 'nanoid'; 

//mui
import { Container, Box, Button, TextField, Typography, Card, Input, FormLabel, Stack, Grid, FormGroup, FormControl, Alert, Paper } from '@mui/material';

export default function Signup() {

  const [alertObj, setAlertObj] = useState({ msg: "hello", severity: "error", visibility: "hidden" });

  const emailInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
  }, []);


  const handleSignupButtonClick = async (e) => {

    const url = 'http://127.0.0.1:4000/signup';
    const data = {
      shortID: nanoid(10),
      username: usernameInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };

    // console.log(data);

    await axios.post(url, data).then(function (response) {

      if(response.data.status){
        // setAlertObj({ ...alertObj, msg: "user created successfully", severity: "success",visibility: "visible"  })
        setAlertObj({ ...alertObj, msg: response.data.msg, severity: "success",visibility: "visible"  })
        console.log(response.data);
        // console.log("new user data from db:  ");
        
      }else{
        setAlertObj({ ...alertObj, msg: response.data.msg, severity: "error",visibility: "visible"  })
        console.log(response.data);

      }

    }).catch(function (error) {
      console.log(error.response.data);
      setAlertObj({ ...alertObj, msg: error.response.data.msg[0].message, visibility: "visible" });

    });

  }

  return (
    <Box height="100%">
      <Container sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper elevation={3} sx={{ width: "60%" }}>
          <FormControl sx={{ width: "100%", textAlign: "center", bgcolor: "whitesmoke", py: 3 }}>
            <Typography variant={"h3"} component={"h3"}>
              Signup
            </Typography>
            <FormGroup sx={{ width: { xs: "100%", sm: "60%", md: "40%" }, alignSelf: "center", my: 3, gap: 1 }}>
              <TextField inputRef={usernameInputRef} required label="username" variant="filled" margin="normal" helperText="5-20 characters" />
              <TextField inputRef={emailInputRef} required label="email" variant="filled" margin="normal" />
              <TextField inputRef={passwordInputRef} required label="password" variant="filled" margin="normal" helperText="6-15 characters" />
              <Button sx={{ width: 1 / 5, alignSelf: "center", bgcolor: "black", m: 2 }} onClick={handleSignupButtonClick}>signup</Button>
            </FormGroup>
            <Alert variant='outlined' severity={alertObj.severity} sx={{ mb: 0, mt: 4, mx: 2, visibility: alertObj.visibility, width: "80%", alignSelf: "center" }} >
              {alertObj.msg}
            </Alert>
          </FormControl>
        </Paper>
      </Container>
    </Box>
  )
}
