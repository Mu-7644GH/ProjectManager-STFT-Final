// import logo from './logo.svg';
import "./App.css";
import { Box } from "@mui/material";

//react-router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//redux
import { useSelector } from "react-redux";

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

//routes
import ProjectMainView from "./pages/project/ProjectMainView";
import ProjectChatView from "./pages/project/ProjectChatView";
import ProjectOverView from "./pages/project/ProjectOverView";
import ProjectSettingsView from "./pages/project/ProjectSettingsView";

// import UserHomepage from './pages/user/UserHomepage'
import UserSettings from './pages/user/UserSettings'
import UserInbox from './pages/user/UserInbox'
import UserCalendar from './pages/user/UserCalendar'
import UserNotifications from './pages/user/UserNotifications'

function App() {
  const aut = false;
  let currentAuthState = useSelector((state) => state.auth);

  return (
    <Router>
      <Box
        // bgcolor="greenyellow"
        className="App"
        height="100vh"
        display="flex"
        flexDirection="column"
      >
        <Nav />
        <Routes>
          <Route path="/" element={currentAuthState ? <UserHomepage /> : <Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route  path="/faq" element={<FAQ />} />
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
    </Router>
  );
}

export default App;
