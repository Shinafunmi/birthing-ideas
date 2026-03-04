import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Notifications from './components/Notifications'; 

function App() {
  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/notification" element={<Notifications />} />
    </Routes>
  );
}

export default App;
