// frontend/src/pages/EventDetailPage.js
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Card, CardMedia, CardContent, Typography, TextField, Button, List, ListItem, Box, Paper } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CommentCard = ({ comment }) => (
    <Card sx={{ marginBottom: 2 }}> 
      <CardContent sx={{ padding: 2 }}> 
        <Typography variant="subtitle1" component="div" fontWeight="bold">
          {comment.author.username + ' - ' + comment.author.score}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {comment.content}
        </Typography>
      </CardContent>
    </Card>
);

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [comment, setComment] = useState('');
  const commentsRef = useRef(null);
  const { user } = useUser();

  const scrollToTopOfComments = () => {
    // If there is a comments section and it has children (comments), scroll the first one into view
    if (commentsRef.current && commentsRef.current.firstChild) {
      commentsRef.current.firstChild.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getEvent = () => {
    axiosInstance.get(`/api/events/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error('Error fetching event:', error);
      });
  }
  
  // Fetch the event details
  useEffect(() => {
    getEvent();
  }, [eventId]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      // Assuming you already handle user authentication and user ID is accessible
      const response = await axiosInstance.post(`/api/events/${eventId}/comments`, {
        content: comment,
        author: user._id, // Replace with actual user ID from app state/context
      });

      // Update local state to show new comment at the top
      setEvent({ 
        ...event, 
        comments: [response.data, ...event.comments] // Add new comment at the beginning
      });
      setComment(''); // Clear input after comment is added
      scrollToTopOfComments();
    } catch (error) {
      console.error('Error adding comment:', error.response?.data?.message || error.message);
      // Handle errors by displaying a message to the user
    }
  };
  
  // Resolve the event
  const handleResolveEvent = () => {
    // Implement resolve event logic
    axiosInstance.post(`/api/events/${eventId}/resolve`, { userId: user._id })
      .then((response) => {
        // setEvent({ ...event, isResolved: true });
        getEvent();
      })
      .catch((error) => {
        console.error('Error resolving event:', error);
      });
  };

  if (!event) return <div>Loading...</div>;

  return (
    <>
      <Header title={event.title} />
        <Card style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', margin: '8px' }}>
          <CardMedia
            component="img"
            image={event.image}
            alt={event.title}
            sx={{ height: '250px', objectFit: 'cover' }}
          />
          {/* Event Details */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Location: {event.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created by: {event.createdBy.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created on: {new Date(event.createdDate).toLocaleDateString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button onClick={handleAddComment} sx={{ height: '40px' }}>
                      Post
                    </Button>
                  ),
                }}
              />
            </Box>
          </CardContent>
          <CardContent style={{ flexGrow: 1, overflowY: 'auto' }}
            ref={commentsRef}>
            {event.comments.length > 0 ? (
                <List ref={commentsRef}>
                {event.comments.map((comment, index) => (
                    index === 0 ? <div ref={commentsRef} key={comment._id}><CommentCard comment={comment} /></div> : <CommentCard key={comment._id} comment={comment}/>
                ))}
                </List>
            ) : (
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                No comments
                </Typography>
            )}
          </CardContent>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: '16px' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleResolveEvent}
              disabled={event.isResolved}
            >
                {event.isResolved ? 'Resolved' : 'Resolve'}
            </Button>
          </Box>
        </Card>
      <Footer />
    </>
  );
};

export default EventDetailPage;