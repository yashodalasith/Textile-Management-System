import "./App.css";
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Components/User/Login";
import Home from "./Components/Home/Home";
import UserProfile from "./Components/User/UserProfile";
import UpdateUserProfile from "./Components/User/UpdateUserDetails";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/user" element={<Login />} />
          <Route path="/userProfile" element={<UserProfile />} />

          <Route path="/updateProfile/:id" element={<UpdateUserProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
