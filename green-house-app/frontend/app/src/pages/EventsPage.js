// frontend/src/pages/EventsPage.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CommentIcon from '@mui/icons-material/Comment';
import Footer from '../components/Footer';
import Header from '../components/Header';

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <>
      <Header title="Events" />
      <Box sx={{ marginBottom: '100px' }}>
        {events.map((event, index) => (
            <Card key={event._id} sx={{ mt: 2, mb: 2 }} onClick={() => navigate(`/event/${event._id}`)}>
            <CardMedia
                component="img"
                height="140"
                image={event.image}
                alt={event.title}
                sx={{
                    // Object fit property set to cover will make sure the aspect ratio is maintained and the image is scaled to cover the container without stretching
                    objectFit: 'cover',
                    width: '100%', // Ensure the width matches the card container
                    height: '100%' // You can adjust the height as needed
                }}
                />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {event.isResolved ? (
                    <CheckCircleIcon sx={{ color: "green", mr: 1 }} />
                ) : (
                    <CancelIcon sx={{ color: "red", mr: 1 }} />
                )}
                {event.title}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    {event.description}
                </Typography>

                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CommentIcon sx={{ mr: 1 }} />
                        {`${event.comments.length} comments`}
                    </Typography>
                </Box>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                <Typography variant="body2" color="text.secondary">
                Created by: {event.createdBy.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Location: {event.location}
                </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                <Typography variant="body2" color="text.secondary">
                Created at: {formatDate(event.createdDate)}
                </Typography>
            </Box>
            </CardContent>
            </Card>
        ))}
      </Box>
      <Footer />
    </>
  );
};

export default EventsPage;