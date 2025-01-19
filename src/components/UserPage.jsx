import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Drawer,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MapComponent from "./MapComponent"; // Replace with your actual MapComponent

const UserPage = () => {
  const [profiles, setProfiles] = useState([]); // Stores profiles from localStorage
  const [search, setSearch] = useState(""); // Search query
  const [searchAttribute, setSearchAttribute] = useState("name"); // Attribute for filtering
  const [selectedProfile, setSelectedProfile] = useState(null); // Selected profile for drawer

  // Load profiles from localStorage on component mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem("profiles");
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (error) {
        console.error("Error parsing profiles from localStorage:", error);
      }
    }
  }, []);

  // Filter profiles based on search query and attribute
  const filteredProfiles = profiles.filter((profile) => {
    const attributeValue = profile[searchAttribute]?.toString().toLowerCase();
    return attributeValue?.includes(search.toLowerCase());
  });

  // Handlers
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleAttributeChange = (e) => setSearchAttribute(e.target.value);
  const handleViewProfile = (profile) => setSelectedProfile(profile);
  const handleCloseDrawer = () => setSelectedProfile(null);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      {/* Header Section */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          padding: 2,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: 1, color: "#1976d2" }}
        >
          User Profiles
        </Typography>

        {/* Search and Attribute Selection */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* Attribute Dropdown */}
          <FormControl fullWidth sx={{ maxWidth: 200 }}>
            <InputLabel id="search-attribute-label">Search By</InputLabel>
            <Select
              labelId="search-attribute-label"
              value={searchAttribute}
              onChange={handleAttributeChange}
              label="Search By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="location">Location</MenuItem>
              <MenuItem value="age">Age</MenuItem>
              <MenuItem value="description">Description</MenuItem>
              {/* Add more attributes as needed */}
            </Select>
          </FormControl>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder={`Search by ${searchAttribute}...`}
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Profiles Section */}
      <Box sx={{ padding: 3 }}>
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <Card
              key={profile.id}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 2,
                boxShadow: 2,
                borderRadius: 2,
              }}
            >
              {/* Profile Photo */}
              <CardMedia
                component="img"
                alt={profile.name}
                image={profile.photo}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  margin: 2,
                  objectFit: "cover",
                }}
              />
              {/* Profile Details */}
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: 1 }}
                >
                  {profile.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 1 }}
                >
                  {profile.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Age: {profile.age}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {profile.location.lat}, {profile.location.lng}
                </Typography>
              </CardContent>
              {/* Action Button */}
              <Box sx={{ padding: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewProfile(profile)}
                >
                  Summary
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            sx={{ marginTop: 5 }}
          >
            No profiles found. Try searching for a different {searchAttribute}.
          </Typography>
        )}
      </Box>

      {/* Profile Summary Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selectedProfile)}
        onClose={handleCloseDrawer}
      >
        {selectedProfile && (
          <Box sx={{ width: 350, padding: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
            >
              Profile Details
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Name:</strong> {selectedProfile.name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Description:</strong> {selectedProfile.description}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Age:</strong> {selectedProfile.age}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              <strong>Location:</strong> {selectedProfile.location.lat},{" "}
              {selectedProfile.location.lng}
            </Typography>
            <MapComponent
              lat={selectedProfile.location.lat}
              lng={selectedProfile.location.lng}
              zoom={10}
              containerStyle={{ height: "200px", width: "100%" }}
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={handleCloseDrawer}
            >
              Close
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default UserPage;
