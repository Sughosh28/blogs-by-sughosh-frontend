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


function App() {

  return (
    <div >
      <Router>
        <Header />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/register' element={<Register />} />
          <Route path='/validate' element={<ValidateOTP />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/edit-profile' element={<UpdateProfile />} />
          <Route path='/upload-profile-picture' element={<UploadProfilePicture />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/add-post' element={<CreatePost />} />
          <Route path='/search' element={<Search />} />
          <Route path="/profile/:userId" element={<ViewProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
