// frontend/src/pages/CreateEventPage.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventLocationInput from '../components/EventLocationInput';
import axiosInstance from '../services/axiosInstance';
import { useUser } from '../contexts/UserContext'; // Import the useUser hook
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateEventPage = () => {
    const navigate = useNavigate();
    const { user } = useUser(); // Use the useUser hook to access the user context
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        image: null // Placeholder state for image, will handle image separately
    });
    const [location, setLocation] = useState([]);

    // Handle change for title and description inputs
    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    // Handle the location change from the EventLocationInput component
    const onLocationSelect = (location) => {
        setLocation(location)
    };

    const handleEventCreation = async (e) => {
        e.preventDefault();
        console.log('Event Data:', eventData);
        console.log('Location', location.toString());

        debugger;
        const formData = new FormData();
        formData.append('title', eventData.title);
        formData.append('description', eventData.description);
        formData.append('location', location.join(','));
        formData.append('createdBy', user._id);
        formData.append('image', eventData.image); // Append the image last

        // Submit eventData to your backend API to create the event
        try {
            debugger;
            const response = await axiosInstance.post('/api/events/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      
          console.log('Event created:', response.data);
          navigate('/events'); // Redirect to events overview page
        } catch (error) {
            console.error('Error creating event:', error.response.data);
            // Implement error handling (e.g., show a notification)
        }
    };
    
    return (
        <>
          <Header title="Create Event" />
          <Box component="main" sx={{ margin: '16px', marginBottom: '100px' }}>
            <Paper elevation={6} sx={{ padding: '16px' }}>
              <form onSubmit={handleEventCreation}>
                <Typography variant="h6">Event Details</Typography>
                <TextField
                  name="title"
                  label="Title"
                  value={eventData.title}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  name="description"
                  label="Description"
                  value={eventData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  required
                />
                <Typography variant="h6" sx={{ mt: 2 }}>Location</Typography>
                <EventLocationInput onLocationSelect={onLocationSelect}/>
                <TextField
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEventData({ ...eventData, image: e.target.files[0] })}
                    fullWidth
                    margin="normal"
                />
                {/* Include image upload and other inputs */}
                <Button type="submit" variant="contained" sx={{ mt: 4 }}>
                  Create Event
                </Button>
              </form>
            </Paper>
          </Box>
          <Footer />
        </>
      );
};

export default CreateEventPage;