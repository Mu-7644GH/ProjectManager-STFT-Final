import { Avatar, Box, Button, Collapse, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { CloseOutlined, ExpandLess, ExpandMore, PersonAddOutlined, PersonRemoveAlt1Outlined } from '@mui/icons-material'

import { addMembers_put, getProjectMembers, removeMember_del } from '../../services/ProjectServices'
import { useDispatch, useSelector } from 'react-redux'
import { updateSnackbar } from '../../redux/projectsSlice'


export default function MembersRow(props) {

    const { shortid: projectShortId, projectname } = useParams();
    const dipatch = useDispatch();
    const adminMemberInput = useRef();
    const userMemberInput = useRef();

    const { isUserLoggedIn: reduxIsUserLoggedIn, accessToken: reduxAccessToken } = useSelector((state) => state.user)
    // const {openProjectData : reduxOpenProjectData} = useState((state) => useSelector.projects)

    const [members, setMembers] = useState({ owner: {}, admins: [], users: [] });
    const [isUsersListOpen, setIsUsersListOpen] = useState(true);
    const [isAdminsListOpen, setIsAdminsListOpen] = useState(true);

    const [isAdminSerchbarOpen, setIsAdminSearchbarOpen] = useState(false)
    const [isUserSerchbarOpen, setIsUserSearchbarOpen] = useState(false)
    
    const [adminSerchAlert, setAdminSearchalert] = useState({vis: false, msg: null});
    const [userSerchAlert, setUserSearchalert] = useState({vis: false, msg: null});

    useEffect(() => {
        getApi();
    }, [])

    const getApi = async () => {
        let tmp = await getProjectMembers(reduxAccessToken, projectShortId);
        setMembers(tmp);
        console.log(tmp);

    }

    const printMembers = () => {
        console.log(members?.admins[0]);
    }

    const handleUserListCollapse = () => {
        setIsUsersListOpen(!isUsersListOpen);
    }

    const handleAdminsListCollapse = () => {
        setIsAdminsListOpen(!isAdminsListOpen);
    }

    const handleThemeColorSelection = () => {

    }

    const addMember = async (_type, _val) => {
        let res = await addMembers_put(_type, _val, reduxAccessToken, projectShortId);
        dipatch(updateSnackbar({isOpen: true, msg: res.msg, sev: res.sev}));
    }
    
    const removeMember = async (_type, _val) => {
        let res = await removeMember_del(_type, _val, reduxAccessToken, projectShortId)
        dipatch(updateSnackbar({isOpen: true, msg: res.msg, sev: res.sev}));
    }

    return (
        <Box>

            <List sx={{ py: 1 }}>
                {/* member.ad */}
                <ListItem>
                    <Box display={"flex"} gap={3} alignItems="center">
                        <ListItemText primary="Owner : " />
                        <Avatar src={members?.owner?.profilePic} sx={{ width: 32, height: 32 }} />
                        <ListItemText secondary={members?.owner?.username} />
                    </Box>
                </ListItem>
                <Divider orientation='horizontal' flexItem={true} />
                <ListItemButton sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* <Typography>admins:</Typography> */}
                    <ListItemText primary="Admins : " onClick={handleAdminsListCollapse} />
                    {isAdminSerchbarOpen && <Box display={"flex"} alignItems={"center"} pr={2} gap={1}>
                        <TextField size='small' inputRef={adminMemberInput} defaultValue={"Search user"}></TextField>
                        <IconButton onClick={() => addMember("admn", adminMemberInput.current.value)}>
                            <PersonAddOutlined size="small" />
                        </IconButton>
                        <IconButton>
                            <CloseOutlined size="small" onClick={() => { setIsAdminSearchbarOpen(false) }} />
                        </IconButton>
                        <Divider orientation='vertical' flexItem={true} />
                    </Box>}
                    {!isAdminSerchbarOpen && <Button size='small' variant="contained" sx={{ color: "black", bgcolor: "whitesmoke", mx: 2 }} onClick={() => { setIsAdminSearchbarOpen(true) }}>Add</Button>}
                    {isAdminsListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isAdminsListOpen} timeout="auto" unmountOnExit >

                    <List sx={{maxWidth: "inherit"}}>
                        {
                            members?.admins.map((admin, index) => {
                                return (
                                    <ListItem key={admin?._id} sx={{ pl: 5,bgcolor: "#f2f2f2" }} >
                                        <Box display={"flex"} justifyContent="space-between" flex={1} alignItems="center" >
                                            <Box display={"flex"} gap={2} alignItems="center" >
                                                <Typography fontSize={"small"}>{index}</Typography>
                                                <Avatar src={admin?.profilePic} sx={{ width: 32, height: 32 }} />
                                                <ListItemText secondary={admin?.username} />

                                            </Box>
                                            <Box>
                                                <IconButton onClick={() => removeMember("admn", admin.username)}>
                                                    <PersonRemoveAlt1Outlined />

                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Collapse>
                <Divider orientation='horizontal' flexItem={true} />
                <ListItemButton sx={{ display: "flex", flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                    {/* <Typography>users:</Typography> */}
                    <ListItemText primary="Users :" onClick={handleUserListCollapse} />
                    {isUserSerchbarOpen &&
                        <Box display={"flex"} alignItems={"center"} px={1} gap={1}>
                            <TextField inputRef={userMemberInput} size='small' defaultValue={"Search user"}></TextField>
                            {/* <CloseOutlined size="small" onClick={() => { setIsUserSearchbarOpen(false) }} /> */}
                            {/* <PersonAddOutlined size="small" /> */}
                            <IconButton onClick={() => addMember("usr", userMemberInput.current.value)}>
                                <PersonAddOutlined size="small" />
                            </IconButton>
                            <IconButton>
                                <CloseOutlined size="small" onClick={() => { setIsUserSearchbarOpen(false) }} />
                            </IconButton>
                            <Divider orientation='vertical' flexItem={true} />
                        </Box>
                    }
                    {!isUserSerchbarOpen && <Button size='small' variant="contained" sx={{ color: "black", bgcolor: "whitesmoke", mx: 2 }} onClick={() => { setIsUserSearchbarOpen(true) }}>Add</Button>}
                    {/* <Button size='small' variant="contained" sx={{ color: "black", bgcolor: "whitesmoke", mx: 2 }}>Add</Button> */}
                    {isUsersListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isUsersListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {
                            members?.users.map((user) => {
                                return (
                                    <ListItem key={user?._id} sx={{ pl: 5 }}>
                                        <Box display={"flex"} justifyContent="space-between" flex={1} alignItems="center" bgcolor={"#000"}>
                                            <Box display={"flex"} gap={3} alignItems="center">
                                                <Avatar src={user?.profilePic} sx={{ width: 32, height: 32 }} />
                                                <ListItemText secondary={user.username} />
                                            </Box>
                                            <Box>
                                                <IconButton onClick={() => removeMember("usr", user.username)}>
                                                    <PersonRemoveAlt1Outlined />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Collapse>
            </List>
        </Box>
    )
}
