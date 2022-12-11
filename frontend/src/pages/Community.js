import { Box, Card, Container, IconButton, Pagination, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { DeleteForeverOutlined } from '@mui/icons-material';

export default function Community() {

  const [isLoding, seIsLoading] = useState(true);
  const [projectsList, setProjetcsList] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState("LOADING ITEMS...")

  useEffect(() => {

    getAllProjects();
  }, [])

  const getAllProjects = async () => {
    const url = 'http://127.0.0.1:4000/community';
    const config = {
      headers: { authtoken: localStorage.getItem('token') }
    }
    // loadLocal();

    await axios.get(url, config).then(function (response) {
      if (response.data.status) {
        setProjetcsList(response.data.data)
        console.log(response.data.data)
        seIsLoading(false);
      } else {
        seIsLoading(false)
      }
    })
      .catch(function (error) {
        console.log(error);
      });
  }


  return (
    <Box flex={1}>
      {isLoding
        ? <Typography>{loadingMsg}</Typography>
        : <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", overflow: "auto" }}>
          <Box bgcolor={"whitesmoke"} flex={1} minHeight={"500px"} width="100%" sx={{ display: "flex", flexWrap: 'wrap', justifyContent: "center", py: 5, flex:1 }}>

            {
              projectsList?.map((p) => {
                return (
                  <>
                    {/* <Box height="150px" width="300px">
                      <Typography>p?.name</Typography>
                      <Typography>p?.description</Typography>
                    </Box> */}

                    <Card elevation={3} sx={{ display: "flex", minHeight: "150px", maxHeight: "180px" , width: "70%", my: 3, py: 1, backgroundImage: p.bg }}>
                      {/* <img src='../assets/people/0.jpg' /> */}
                      <Box   sx={{ width: "200px", height: "150px",  backgroundImage: `url(${p.bg})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center",  }} alt="aaaa"  border={1} mx={1} /> 
                      {/* </Box> */}

                      {/* <Box>
                      <img src={p.bg} width="100px" style={{back}}/>
                      </Box> */}
                      <Stack flex={1} padding={1}>
                        <Stack height="80%">
                          {/* <LinkR style={{ textDecoration: "none", color: "black", fontWeight: "bold" }} state={{ projectName: props?.pProjectName }} to={"/p/" + props?.pProjectShortID + "/" + props?.pProjectName?.replace(/\s+/g, '')} onClick={() => { dispatch(updateOpenProjectName(props.pProjectName)) }}> */}
                          <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                            {p?.name}
                          </Typography>
                          {/* </LinkR> */}
                          <Typography variant='body2'>
                            {p?.description}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent={"end"} >
                        </Stack>
                      </Stack>
                    </Card>

                  </>
                )
              })
            }
          </Box>
          {/* <Pagination count={10} /> */}
        </Container>

      }

    </Box>
  )
}
