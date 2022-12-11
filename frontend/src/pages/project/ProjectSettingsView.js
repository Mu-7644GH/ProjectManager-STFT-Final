import { Alert, Backdrop, Box, Button, Card, Divider, FormControlLabel, FormLabel, IconButton, Modal, Paper, Stack, Switch, TextField, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { useRef, useState } from 'react'

import MembersRow from './MembersRow'
import { customPalette } from '../../App'

import { useSelector, useDispatch } from 'react-redux'
import { AddOutlined, Clear, EditOffOutlined, EditOutlined, SaveOutlined, SportsRugbySharp } from '@mui/icons-material'

import { updateProjectBackground, updateThemeColor, updateSnackbar, updateSettingsChanges, updateOpenProjectData, updateProjectTags, updateChangedSettingsFlags, updateProjectName, updateProjectIsPublic, updateIsSettingsChanged, updateProjectThemeColor } from '../../redux/projectsSlice'
import SimpleSnackbar from '../../components/SimpleSnackbar'
import { saveSettingsChanges_put, updateProjectSettings_put } from '../../services/ProjectServices'
import { useParams } from 'react-router-dom'

import { alpha } from "@mui/material";

const bgModalStyle = {
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

const backgroundsList = [
  'https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?cs=srgb&dl=pexels-abdullah-ghatasheh-1631677.jpg&fm=jpg',
  'https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?cs=srgb&dl=pexels-miguel-%C3%A1-padri%C3%B1%C3%A1n-255379.jpg&fm=jpg',
  'https://images.pexels.com/photos/255377/pexels-photo-255377.jpeg?cs=srgb&dl=pexels-miguel-%C3%A1-padri%C3%B1%C3%A1n-255377.jpg&fm=jpg',
  'https://images.pexels.com/photos/716656/pexels-photo-716656.jpeg?cs=srgb&dl=pexels-hikmet-s-716656.jpg&fm=jpg',
  'https://images.pexels.com/photos/2957860/pexels-photo-2957860.jpeg?cs=srgb&dl=pexels-johannes-plenio-2957860.jpg&fm=jpg',
]

export default function ProjectSettingsView() {

  const { shortid: projectShortIdParam } = useParams();
  const dispatch = useDispatch();
  const newTagInputRef = useRef();
  const projectNameInputRef = useRef();

  const { openProjectData: reduxOpenProjectData, changedSettingsFlags: reduxSettingsFlags, isSettingsChanged: reduxIsSettingsChanged } = useSelector((state) => state.projects);
  const { accessToken: reduxAccessToken, isUserLoggedIn: reduxIsUserLoggedIn, roles: reduxRoles } = useSelector((state) => state.user);

  const [projectName, setProjectName] = useState(reduxOpenProjectData?.name)
  const [isPorjectPublicStatus, setIsProjectPublicStatus] = useState(reduxOpenProjectData.isPublic)
  // const [projectTags, setProjectTags] = useState(reduxOpenProjectData.tags);

  const [isEditingprojectName, setIEditingprojectName] = useState(false)
  const [isBackdropOpen, setIsBackdropOpen] = useState(true);
  const [backgroundModal, setBackgroundModal] = useState(false);

  const [saveChangesAlert, setSaveChangesAlert] = useState("Click to save changes!");
  const [isChangesSaved, setIsChangesSaved] = useState(true);
  // const [setingsdArr,]

  const hanldeBackgroundModalOpen = () => {
    if (backgroundModal) {
      console.log("alredy OPEN!!");
    } else {
      setBackgroundModal(true);

    }
  }
  const hanldeBackgroundModalClose = () => {
    setBackgroundModal(false);
  }

  const handleProjectNameChange = (e) => {
    let npn = projectName.trim().replace(/\s\s+/g, ' ');
    if (npn !== reduxOpenProjectData.name && npn.length >= 1) {
      dispatch(updateProjectName(npn))
      dispatch(updateChangedSettingsFlags({ ...reduxSettingsFlags, name: 1 }))
      dispatch(updateIsSettingsChanged(true));
      // setIsChangesSaved(false);
      saveSettingsChanges("name", npn);
    }

  }

  const handlePublicStatusChange = (e) => {
    if (reduxOpenProjectData.isPublic !== e.target.checked) {
      dispatch(updateProjectIsPublic(e.target.checked));
      dispatch(updateChangedSettingsFlags({ ...reduxSettingsFlags, isPublic: 1 }))
      dispatch(updateIsSettingsChanged(true));
      // setIsChangesSaved(false);
      saveSettingsChanges("isPublic", e.target.checked);
    }
  }

  const addTag = () => {
    // let str = "  asdsad asdsad     aaaa   ";
    // window.alert(str.trim());
    let ntg = newTagInputRef.current.value.trim().replace(/\s\s+/g, ' ');
    if (ntg.length === 0) {
      dispatch(updateSnackbar({ isOpen: true, msg: "Please enter tag name.", sev: "error" }));
      newTagInputRef.current.value = newTagInputRef.current.value.trim().replace(/\s\s+/g, ' ')
      return;
    } else if (reduxOpenProjectData.tags.includes(ntg)) {
      dispatch(updateSnackbar({ isOpen: true, msg: "Tag already exists", sev: "error" }));
      newTagInputRef.current.value = newTagInputRef.current.value.trim().replace(/\s\s+/g, ' ')
      return;
    }
    // setProjectTags(projectTags.push(ntg))
    let tgs = [...reduxOpenProjectData.tags];
    if (tgs.length === 0) {
      tgs = [];
      tgs.push(ntg);
    } else {

      tgs.push(ntg);
    }
    dispatch(updateProjectTags(tgs));
    dispatch(updateChangedSettingsFlags({ ...reduxSettingsFlags, tags: 1 }))
    dispatch(updateIsSettingsChanged(true));
    // setIsChangesSaved(false);
    saveSettingsChanges("tags", tgs);
    newTagInputRef.current.value = '';

  }

  const deleteTag = (_tagName) => {
    let tgs = [...reduxOpenProjectData.tags];
    let i = tgs.findIndex(t => t === _tagName);
    // let ntgs = tgs.splice(i, 1);
    tgs.splice(i, 1);

    dispatch(updateProjectTags(tgs));
    dispatch(updateChangedSettingsFlags({ ...reduxSettingsFlags, tags: 1 }))
    dispatch(updateIsSettingsChanged(true));
    // setIsChangesSaved(false);
    saveSettingsChanges("tags", tgs);
  }
  
  const handleThemeColorChange = (_color) => {
    if (_color !== reduxOpenProjectData.themeColor) {
      dispatch(updateProjectThemeColor(_color));
      dispatch(updateChangedSettingsFlags({ ...reduxSettingsFlags, themeColor: 1 }))
      dispatch(updateIsSettingsChanged(true));
      // setIsChangesSaved(false);
      saveSettingsChanges("themeColor", _color);
    }
  }
  
  const handleBackgroundChange = (_url) => {
    if (_url !== reduxOpenProjectData.bg) {
      dispatch(updateProjectBackground(_url))
      dispatch(updateChangedSettingsFlags({ ...reduxSettingsFlags, bg: 1 }))
      dispatch(updateIsSettingsChanged(true));
      // setIsChangesSaved(false);
      saveSettingsChanges("bg", _url);
    }
  }

  const saveSettingsChanges = async (_key, _value) => {
    let res = await saveSettingsChanges_put(_key, _value, reduxOpenProjectData.shortId, reduxAccessToken);
    if (res.status === 1) {
      dispatch(updateSnackbar({ isOpen: true, msg: res.msg, sev: res.sev }));
      return;
    } else {
      dispatch(updateSnackbar({ isOpen: true, msg: res.msg, sev: res.sev }));
      return;
    }
  }

  const handleSaveChanges = async (_key, _data) => {

    let res = await updateProjectSettings_put(_key, _data, projectShortIdParam, reduxAccessToken);
    if (res.status === 1) {
      // setIsChangesSaved(true);
      dispatch(updateSnackbar({ isOpen: true, msg: res.msg, sev: res.sev }));
      dispatch(updateIsSettingsChanged(false));
    }
  }

  return (
    <Container sx={{ flex: 1, bgcolor: "whitesmoke" }}>
      {(reduxRoles?.owner !== true && reduxIsUserLoggedIn === true)
        ?
        <Backdrop open={isBackdropOpen} sx={{ position: "relative", height: "100%", width: "100%", backgroundColor: "rgb(120, 120, 120,0.3)" }}>
          <Typography>No Permissions! accessiable to project's owner only.</Typography>
        </Backdrop>
        :
        (reduxIsUserLoggedIn !== true) ?
          < Backdrop open={isBackdropOpen} sx={{ position: "relative", height: "100%", width: "100%" }}>
            <Typography>Must Owner of this project!</Typography>
          </Backdrop>
          :
          <>
            <Card sx={{ my: 3, p: 2 }}>
              <Stack flex={1} display="flex" gap={2.5} my={3}  >
                <Box display={"flex"} alignItems="center" gap={2} alig>
                  {isEditingprojectName
                    ? <TextField size='small' defaultValue={projectName} inputRef={projectNameInputRef} onChange={(e) => setProjectName(e.target.value)} />
                    : <Typography >Name: {reduxOpenProjectData.name}</Typography>
                  }
                  <IconButton onClick={() => { setIEditingprojectName(!isEditingprojectName) }}>
                    {isEditingprojectName
                      ? <EditOffOutlined fontSize='small' onClick={() => handleProjectNameChange()} />
                      : <EditOutlined fontSize='small' />
                    }
                  </IconButton>
                </Box>
                <Box>
                  <FormLabel>Public :</FormLabel>
                  <Switch checked={reduxOpenProjectData.isPublic} onChange={handlePublicStatusChange} />
                </Box>
                <Box>
                  {/* <Typography>{reduxOpenProjectData.shortId}</Typography> */}
                  <Typography>
                    Tags:
                  </Typography>
                  <Box display="flex" justifyContent="start" gap={1} mx={2} >
                    {
                      reduxOpenProjectData?.tags?.map((tg) => {
                        return <Box bgcolor="whitesmoke" display="flex" alignItems="center" gap={1} sx={{m: "1px", "&:hover": {border: 1, m: "-1px" }}}>
                          <Clear fontSize='small' onClick={() => deleteTag(tg)}/>
                          {tg}
                           </Box>
                      })
                    }
                  </Box>
                  <Box>
                    <IconButton onClick={() => addTag()}>
                      <AddOutlined />
                    </IconButton>
                    <TextField inputRef={newTagInputRef} variant='standard' size='small' sx={{ width: "70px", }} rows={1} />
                  </Box>

                </Box>
                <Box>
                  <Typography>
                    Theme:
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="start" gap={1} mx={2}>
                    {
                      Object.keys(customPalette).map((item) => {
                        return <Box sx={{ width: "16px", height: "16px", bgcolor: `${item}.main`, "&:hover": { border: 2, borderColor: "lightgray" } }} onClick={() => { handleThemeColorChange(`${item}`) }} border={1} > </Box>
                      })
                    }
                  </Box>
                </Box>
                <Box>
                  <Typography>Background:</Typography>
                  <Box display="flex" gap={1} mx={2}>
                    <Box border={1} width={"90px"} height="70px" sx={{ backgroundImage: `url(${reduxOpenProjectData?.bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                      {/* <img src={reduxOpenProjectData?.bg} width="50px" /> */}
                    </Box>
                    <IconButton onClick={() => { hanldeBackgroundModalOpen(); }}>
                      <EditOutlined fontSize='small' />
                    </IconButton>
                  </Box>
                </Box>
              </Stack>

              <Box display="flex" justifyContent={"end"} px={2} gap={2}>
                {reduxIsSettingsChanged ? <Alert severity="warning" size="small">{saveChangesAlert}</Alert> : <></>}
                <IconButton onClick={handleSaveChanges}>
                  <SaveOutlined fontSize='large' />
                </IconButton>
              </Box>
            </Card>

            <Divider />

            <Card sx={{ my: 3, p: 2 }}>

              <Box minHeight="100px">
                <MembersRow pToken={reduxAccessToken} pProjectShortId={reduxOpenProjectData.shortId} />
              </Box>
            </Card>
          </>
      }
      <Modal open={backgroundModal} onClose={hanldeBackgroundModalClose} >
        <Paper sx={bgModalStyle}>
          <Box display="flex-wrap" p={2}>
            <Typography variant='h5'>Choose Project Background:</Typography>
            {
              backgroundsList.map((url) => {
                let icbg = reduxOpenProjectData?.bg === url ? true : false;
                return (<Box display="inline-block" m={1} sx={{ border: icbg ? 2 : 0, borderColor: icbg ? "green" : "black", transition: 'transform 0.3s', "&:hover": icbg ? null : { transform: 'scale(1.1)' } }} onClick={() => handleBackgroundChange(url)}> <img src={url} width={icbg ? "220px" : "200px"} /> </Box>);
              })
            }
          </Box>

        </Paper>
      </Modal>
      <SimpleSnackbar />
    </Container >
  )
}
