import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  TablePagination,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import profileData from "../data/profiles.json";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const NewAdmin = () => {
  const [Profile, setProfile] = useState([]);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [error, setError] = useState("");
  const [loadingMap, setLoadingMap] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [loadingData, setLoadingData] = useState(true); // Loading state for profile data

  useEffect(() => {
    const savedProfiles = localStorage.getItem("profiles");
    if (savedProfiles) {
      setProfile(JSON.parse(savedProfiles));
      setLoadingData(false); // Stop loading once profiles are fetched
    } else {
      setProfile(profileData);
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (Profile.length > 0) {
      localStorage.setItem("profiles", JSON.stringify(Profile));
    }
  }, [Profile]);

  const geocodeAddress = async (address) => {
    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ address: address });
      if (response.results.length > 0) {
        const { lat, lng } = response.results[0].geometry.location;
        return { lat: lat(), lng: lng() };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      setGeocodeError("Unable to geocode the address. Please try again.");
      return null;
    }
  };

  const handleEdit = (id) => {
    const profileToEdit = Profile.find((item) => item.id === id);
    if (profileToEdit) {
      setEditingProfile(profileToEdit);
      setName(profileToEdit.name);
      setPhoto(profileToEdit.photo);
      setDescription(profileToEdit.description);
      setAge(profileToEdit.age);
      setLocation(profileToEdit.location.formattedAddress);
      setOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedProfiles = Profile.filter((item) => item.id !== id);
      setProfile(updatedProfiles);
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
    }
  };

  const handleClear = () => {
    setName("");
    setPhoto("");
    setDescription("");
    setAge("");
    setLocation("");
    setError("");
    setGeocodeError("");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (name && photo && description && age && location) {
      if (geocodeError) {
        setError("Please fix the geocoding error before saving.");
        return;
      }

      const geocodeData = await geocodeAddress(location);

      if (geocodeData) {
        if (editingProfile) {
          const updatedProfiles = Profile.map((profile) =>
            profile.id === editingProfile.id
              ? {
                  ...profile,
                  name,
                  photo,
                  description,
                  age: parseInt(age),
                  location: { ...geocodeData, formattedAddress: location },
                }
              : profile
          );
          setProfile(updatedProfiles);
        } else {
          const newProfile = {
            id: Date.now(),
            name,
            photo,
            description,
            age: parseInt(age),
            location: { ...geocodeData, formattedAddress: location },
          };
          setProfile([...Profile, newProfile]);
        }

        handleClear();
        setOpen(false);
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  const filteredProfiles = Profile.filter((profile) =>
    profile.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProfiles = filteredProfiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMapOpen = (profile) => {
    setSelectedProfile(profile);
    setMapOpen(true);
  };

  const handleMapClose = () => {
    setMapOpen(false);
    setSelectedProfile(null);
  };

  const handleMapLoad = () => {
    setLoadingMap(false);
  };

  const handleMapError = () => {
    setMapError(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        backgroundColor: "#e3f2fd",
        position: "relative",
      }}
    >
      {/* Show loading spinner if data is still being fetched */}
      {loadingData && <CircularProgress sx={{ marginBottom: 2 }} />}

      {!open && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ marginBottom: 2 }}
        >
          Add Profile
        </Button>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      {geocodeError && (
        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
          {geocodeError}
        </Typography>
      )}

      <Box
        sx={{
          filter: open ? "blur(5px)" : "none",
          pointerEvents: open ? "none" : "auto",
          transition: "filter 0.3s ease",
          width: "100%",
        }}
      >
        <Grid item xs={12} sm={12}>
          <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 3 }}>
            <Typography
              variant="h5"
              sx={{ marginBottom: 2, fontWeight: "bold", color: "#1976d2" }}
            >
              Profiles List
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
              <TextField
                variant="outlined"
                label="Search Profiles"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: "100%", sm: "250px" } }}
              />
            </Box>

            {/* Show a progress bar while the table is rendering */}
            {loadingData && <LinearProgress sx={{ marginBottom: 2 }} />}

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr. No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProfiles.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Avatar
                          src={item.photo}
                          alt={item.name}
                          sx={{ width: 50, height: 50 }}
                        />
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.age}</TableCell>
                      <TableCell>{item.location.formattedAddress}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(item.id)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleMapOpen(item)}
                        >
                          Summary
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProfiles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Box>

      {/* Map modal */}
      {mapOpen && selectedProfile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 800,
              padding: 3,
              boxShadow: 3,
              borderRadius: 3,
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // To push content to the top and bottom
              maxHeight: "90vh", // Restrict modal height to fit screen
              overflow: "hidden", // Ensure content stays inside modal
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%", // Take full available height
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2", marginBottom: 2 }}>
                Profile Location
              </Typography>

              {/* Centered Loading Indicator */}
              {loadingMap ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "400px", // Set a fixed height for the map container
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : mapError ? (
                <Typography variant="body2" sx={{ color: "red" }}>
                  Failed to load the map. Please try again later.
                </Typography>
              ) : (
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" onLoad={handleMapLoad} onError={handleMapError}>
                  <GoogleMap
                    mapContainerStyle={{ height: "400px", width: "100%" }}
                    center={{
                      lat: selectedProfile.location.lat,
                      lng: selectedProfile.location.lng,
                    }}
                    zoom={10}
                  >
                    <Marker
                      position={{
                        lat: selectedProfile.location.lat,
                        lng: selectedProfile.location.lng,
                      }}
                    />
                  </GoogleMap>
                </LoadScript>
              )}
            </CardContent>

            {/* Close button aligned at the bottom of the modal */}
            <Box sx={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleMapClose}
                sx={{ width: "100%", maxWidth: "200px" }}
              >
                Close Map
              </Button>
            </Box>
          </Card>
        </Box>
      )}

      {/* Profile Form Modal */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 600,
              padding: 3,
              boxShadow: 3,
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  {editingProfile ? "Edit Profile" : "Create Profile"}
                </Typography>
                <IconButton onClick={() => setOpen(false)} color="secondary">
                  <CloseIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div style={{ position: "relative", width: "100%" }}>
                    <TextField
                      fullWidth
                      label="Upload your photo"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={photo ? "File Selected" : "No file chosen"}
                      sx={{ marginBottom: 2 }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location (Place or Address)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ marginBottom: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default NewAdmin;