import React from 'react';
import { BrowserRouter,Navigate,Route,Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Editprofile from './pages/Editprofile';
import CreatePost from './pages/CreatePost';
import Navbar from './components/Navbar';
import SearchResult from './pages/SearchResult';
import NotFound from './components/NotFound';
import LandingPage from './pages/LandingPage';

const App=()=>{
  
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/feed' element={<Feed/>}></Route>
        <Route path='/edit-profile' element={<Editprofile/>}></Route>
        <Route path='/create-post' element={<CreatePost/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/search' element={<SearchResult/>}></Route>
        <Route path='/register' element={<Signup/>}></Route>
        <Route path='/profile/:id' element={<Profile/>}></Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;