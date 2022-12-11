// import logo from './logo.svg';
import "./App.css";
import { Box, CssBaseline, Typography } from "@mui/material";

//react-router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import { updateAccessToken, updateIsUserLoggedIn } from './redux/userSlice'

//Mui
import Nav from "./components/Nav";
import Homepage from "./pages/Homepage";
import Signup from "./pages/SignUp";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import ContactUs from "./pages/ContactUs";
import UserLayout from "./pages/user/UserLayout";
import ProjectLayout from "./pages/project/ProjectLayout";
import PageNotFound from "./pages/PageNotFound";
import UserHomepage from "./pages/user/UserHomepage";
import { createTheme, ThemeProvider } from '@mui/material'


//routes
import ProjectMainView from "./pages/project/ProjectMainView";
import ProjectChatView from "./pages/project/ProjectChatView";
import ProjectOverView from "./pages/project/ProjectOverView";
import ProjectSettingsView from "./pages/project/ProjectSettingsView";
import UserSettings from './pages/user/UserSettings'
import UserInbox from './pages/user/UserInbox'
import UserCalendar from './pages/user/UserCalendar'
import UserNotifications from './pages/user/UserNotifications'
import { useEffect, useState } from "react";
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from "@mui/material/colors";
import Community from "./pages/Community";

export const customPalette = {
  primary: {
    main: teal[500],
    light: teal[100],
    dark: teal[900],
  },
  custom_red: {
    main: red[500],
    light: red[100],
    dark: red[900],
  },
  custom_pink: {
    main: pink[500],
    light: pink[100],
    dark: pink[900],
  },
  custom_purple: {
    main: purple[500],
    light: purple[100],
    dark: purple[900],
  },
  custom_deepPurple: {
    main: deepPurple[500],
    light: deepPurple[100],
    dark: deepPurple[900],
  },
  custom_indigo: {
    main: indigo[500],
    light: indigo[100],
    dark: indigo[900],
  },
  custom_blue: {
    main: blue[500],
    light: blue[100],
    dark: blue[900],
  },
  custom_lightBlue: {
    main: lightBlue[500],
    light: lightBlue[100],
    dark: lightBlue[900],
  },
  custom_cyan: {
    main: cyan[500],
    light: cyan[100],
    dark: cyan[900],
  },
  custom_teal: {
    main: teal[500],
    light: teal[100],
    dark: teal[900],
  },
  custom_green: {
    main: green[500],
    light: green[100],
    dark: green[900],
  },
  custom_lightGreen: {
    main: lightGreen[500],
    light: lightGreen[100],
    dark: lightGreen[900],
  },
  custom_lime: {
    main: lime[500],
    light: lime[100],
    dark: lime[900],
  },
  custom_yellow: {
    main: yellow[500],
    light: yellow[100],
    dark: yellow[900],
  },
  custom_amber: {
    main: amber[500],
    light: amber[100],
    dark: amber[900],
  },
  custom_orange: {
    main: orange[500],
    light: orange[100],
    dark: orange[900],
  },
  custom_deepOrange: {
    main: deepOrange[500],
    light: deepOrange[100],
    dark: deepOrange[900],
  },
  custom_brown: {
    main: brown[500],
    light: brown[100],
    dark: brown[900],
  },
}

function App() {
  const aut = false;
  // let currentAuthState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const { isUserLoggedIn: reduxIsUserLoggedIn } = useSelector((state) => state.user);
  const [darkOrLightMode, setDarkOrLightMode] = useState(localStorage.getItem('darkOrLight') ? localStorage.getItem('darkOrLight') : "light");

  const theme = createTheme({ palette: { ...customPalette, mode: darkOrLightMode } })
  // const theme = createTheme({palette: {
  //   mode: darkOrLightMode,
  //    primary: {
  //     main: red[100]}
  //   }
  // })

  useEffect(() => {
    getData();
    console.log("loaded app....")

  }, [])

  const getData = async () => {
    if (localStorage.getItem('isLogged') !== null) {
      if(localStorage.getItem('token') !== null){
        dispatch(updateAccessToken(localStorage.getItem('token')))
        dispatch(updateIsUserLoggedIn(true));
        setIsLoading(false);
      }
    } else {
      // dispatch(updateIsUserLoggedIn(true));
      setIsLoading(false);
    }
  }


  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoading ? <Typography>LOADING APPP....</Typography> :
          <Box
            // bgcolor="greenyellow"
            className="App"
            height="100vh"
            display="flex"
            flexDirection="column"
          >
            <Nav />
            <Routes>
              <Route path="/" element={reduxIsUserLoggedIn === true ? <UserHomepage /> : <Homepage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/community" element={<Community />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/u/:userShortID" element={<UserLayout />}>
                <Route path="/u/:userShortID/home" element={<UserHomepage />} />
                <Route path="/u/:userShortID/inbx" element={<UserInbox />} />
                <Route path="/u/:userShortID/notifications" element={<UserNotifications />} />
                <Route path="/u/:userShortID/settings" element={<UserSettings />} />
              </Route>
              <Route path="/p/:shortid/:projectname" element={<ProjectLayout />}>
                <Route path="/p/:shortid/:projectname" element={<ProjectMainView />} />
                <Route path="/p/:shortid/:projectname/cht" element={<ProjectChatView />} />
                <Route path="/p/:shortid/:projectname/ov" element={<ProjectOverView />} />
                <Route path="/p/:shortid/:projectname/stngs" element={<ProjectSettingsView />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Box>
        }
      </ThemeProvider>
    </Router>
  );
}

export default App;
