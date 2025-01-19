import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Icon for the mobile menu

export function Navbar() {
  const [open, setOpen] = useState(false); // State to manage the mobile menu open/close
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage admin login status
  const theme = useTheme(); // Material UI's useTheme hook
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen is mobile size
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Toggle the Drawer menu
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Handle logout action
  const handleLogout = () => {
    setIsLoggedIn(false); // Clear admin login state
    navigate('/'); // Redirect to the home or login page
  };

  return (
    <AppBar position="sticky" color="primary" sx={{ boxShadow: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Profile View
        </Typography>

        {/* Mobile Menu Icon */}
        {isMobile ? (
          <IconButton color="inherit" edge="end" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        ) : isLoggedIn ? (
          // Show Logout Button for Desktop when logged in
          <Button color="inherit" onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#5c6bc0' } }}>
            Logout
          </Button>
        ) : (
          // Show Admin Login and User Profile when not logged in
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/" sx={{ '&:hover': { backgroundColor: '#5c6bc0' } }}>
              Admin Login
            </Button>
            <Button color="inherit" component={Link} to="/users" sx={{ '&:hover': { backgroundColor: '#5c6bc0' } }}>
              User Profile
            </Button>
          </Box>
        )}

        {/* Drawer for mobile */}
        <Drawer anchor="right" open={open} onClose={handleDrawerToggle}>
          <List sx={{ width: 250 }}>
            {isLoggedIn ? (
              // Show Logout for Mobile when logged in
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            ) : (
              // Show Admin Login and User Profile for Mobile when not logged in
              <>
                <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
                  <ListItemText primary="Admin Login" />
                </ListItem>
                <ListItem button component={Link} to="/users" onClick={handleDrawerToggle}>
                  <ListItemText primary="User Profile" />
                </ListItem>
              </>
            )}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export function Footer() {
  return (
    <Box component="footer" sx={{ textAlign: 'center', py: 4, borderTop: 1, backgroundColor: '#2c387e', color: '#fff', mt: 3 }}>
      <Typography variant="body2" sx={{ fontStyle: 'italic', letterSpacing: 1.2 }}>
        Your go-to platform for profile management
      </Typography>
      <Typography variant="body2">
        Profile View © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
