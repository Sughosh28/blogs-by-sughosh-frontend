import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from '../src/header/Header';
import Login from '../src/components/Login';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Feed from './components/Feed';
import ValidateOTP from './components/ValidateOTP';
import Register from './components/Register';
import Profile from './components/Profile';
import ViewProfile from './components/ViewProfile';
import UpdateProfile from './components/UpdateProfile';
import UploadProfilePicture from './components/UploadProfilePicture';
import CreatePost from "./components/CreatePost";
import Search from "./components/Search";
import Settings from "./components/Settings";
import PropTypes from 'prop-types';
import {useEffect} from 'react';


function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<PageWrapper component={Login} title="Login" />} />
          <Route path="/home" element={<PageWrapper component={Home} title="Home" />} />
          <Route path="/forgot-password" element={<PageWrapper component={ForgotPassword} title="Forgot Password" />} />
          <Route path="/register" element={<PageWrapper component={Register} title="Register" />} />
          <Route path="/validate" element={<PageWrapper component={ValidateOTP} title="Validate OTP" />} />
          <Route path="/profile" element={<PageWrapper component={Profile} title="Profile" />} />
          <Route path="/edit-profile" element={<PageWrapper component={UpdateProfile} title="Edit Profile" />} />
          <Route path="/upload-profile-picture" element={<PageWrapper component={UploadProfilePicture} title="Upload Profile Picture" />} />
          <Route path="/feed" element={<PageWrapper component={Feed} title="Feed" />} />
          <Route path="/add-post" element={<PageWrapper component={CreatePost} title="Create Post" />} />
          <Route path="/search" element={<PageWrapper component={Search} title="Search" />} />
          <Route path="/profile/:userId" element={<PageWrapper component={ViewProfile} title="View Profile" />} />
          <Route path="/settings" element={<PageWrapper component={Settings} title="Settings" />} />
        </Routes>
      </Router>
    </div>
  );
}


const PageWrapper = ({ component: Component, title }) => {
  useEffect(() => {
    document.title = title ? `${title} - BlogsBySughosh` : "BlogsBySughosh";
  }, [title]);

  return <Component />;
}
PageWrapper.propTypes = {
  component: PropTypes.elementType.isRequired,
  title: PropTypes.string
};


export default App;

