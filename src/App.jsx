import React, { useState } from "react"; // Added useState import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";

import { Footer, Navbar } from "./components/Navbar";
import NewAdmin from "./components/NewAdmin";
import UserPage from "./components/UserPage";

const App = () => {
  const [userData, setUserData] = useState([]); // Shared state for users

  const handleAddUser = (newUser) => {
    setUserData((prevData) => [...prevData, newUser]); // Add new user to state
  };

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route
            path="/new"
            element={<NewAdmin addUser={handleAddUser} />} // Pass handleAddUser to NewAdmin
          />
          <Route
            path="/users"
            element={<UserPage users={userData} />} // Pass userData to UserPage
          />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
