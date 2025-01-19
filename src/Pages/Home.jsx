import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/styles.css";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Initialize navigation

  const handleSummaryClick = (location) => {
    setSelectedLocation(location);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    // Replace with real authentication logic
    if (loginDetails.email === "admin@gmail.com" && loginDetails.password === "admin") {
      navigate("/new"); // Redirect to NewAdmin.jsx
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f4f8",
        padding: "10px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "20px", // Adjust padding for smaller devices
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{
            width: "100%", // Ensure tabs span the full width
          }}
        >
          <Tab label="Login" />
          
        </Tabs>
        {tabValue === 0 && (
          <Box mt={3}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              value={loginDetails.email}
              onChange={handleInputChange}
              sx={{
                marginBottom: "15px",
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={loginDetails.password}
              onChange={handleInputChange}
              sx={{
                marginBottom: "20px",
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{
                marginTop: "10px",
                padding: "10px 0",
                borderRadius: "25px",
              }}
            >
              Login
            </Button>
          </Box>
        )}
        {tabValue === 1 && (
          <Box mt={3}>
            <Typography variant="body1">Sign-up functionality coming soon.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Home;
