import { CloseOutlined, DeleteForeverOutlined, DescriptionOutlined, SaveOutlined, TitleOutlined } from '@mui/icons-material';
import { Box, Card, Typography, Modal, Button, Stack, IconButton } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import { Draggable } from '@hello-pangea/dnd'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: { xs: "100%", md: "80%", lg: "50%" },
  minHeight: { xs: "100%", md: "80%", lg: "50%" },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
};

export default function Task({ pProjectShortID, pListID, pItem, pTaskID, pTaskTitle, pIndex }) {
  const [isModalLoading, setIsModalLoading] = useState(true);
  const [taskData, setTaskData] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    if (open) {
      console.log("alredy OPEN!!");
    } else {
      setOpen(true); getTaskInfo();

    }
  };
  const handleClose = () => setOpen(false);

  // let currentToken = useSelector((state) => state.accessToken);
  const { accessToken: reduxAccessToken } = useSelector((state) => state.user);

  const getTaskInfo = async () => {
    let url = 'http://127.0.0.1:4000/tasks/getone/' + pProjectShortID + '/' + pListID + '/' + pTaskID;
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    try {

      let response = await axios.get(url, config).then((response) => response);
      console.log(response.data)
      setTaskData(response.data.data)
      setIsModalLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async () => {
    let url = 'http://127.0.0.1:4000/tasks/del/' + pProjectShortID + '/' + pListID + '/' + pTaskID;
    const config = {
      headers: { authtoken: reduxAccessToken }
    }

    try {

      let response = await axios.delete(url, config).then((response) => response);
      console.log(response.data)
      setTaskData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Draggable draggableId={pTaskID} index={pIndex} >
        {(provided) => (
          <Card elevation={3} sx={{ my: 1, p: 1.5, minWidth: "200px", "&:hover": { opacity: "70%" }, minHeight: "45px", display: "flex", flexGrow: 1, flexBasis: 0, }} onClick={handleOpen} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <Typography>
              {pTaskTitle}
              {/* {pTaskID} */}
            </Typography>
          </Card>
        )}
      </Draggable>

      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {
              isModalLoading ? <Typography variant='h4' alignSelf={"center"}> LOADING...</Typography> :
                <>
                  <Box display="flex" justifyContent="end" >
                    <IconButton>
                      <CloseOutlined onClick={handleClose} />
                    </IconButton>
                  </Box>

                  <Stack p={1} border={1}>
                    <Box display={"flex"} gap={1} mb={2} alignItems="center">
                      <TitleOutlined />
                      <Typography contentEditable={true} id="modal-modal-title" variant="h5" component="h2">
                        {taskData.title}
                      </Typography>
                    </Box>
                    <Box mb={2} >
                      <Box display={"flex"} gap={1} alignItems="center">
                        <DescriptionOutlined />
                        <Typography contentEditable={true} id="modal-modal-title" variant="h5" component="h2">
                          Description
                        </Typography>
                      </Box>
                      <Box border={1} my={1}>
                        <Typography contentEditable={true} id="modal-modal-description" sx={{ mt: 2 }}>
                          {taskData.description}
                        </Typography>
                      </Box>
                      <Typography>
                        {pListID}
                        {"\n"}
                        {pTaskID}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="end" gap={4} pr={4}>
                      <Button>
                        <DeleteForeverOutlined onClick={deleteTask} fontSize='large' />
                      </Button>
                      <IconButton>
                        <SaveOutlined fontSize='large' />
                      </IconButton>
                      {/* <Button></Button> */}
                    </Box>
                  </Stack>
                </>
            }
          </Box>
        </Modal>
    </>
  )
}
