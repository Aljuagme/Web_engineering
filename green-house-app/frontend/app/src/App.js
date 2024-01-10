import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { Container } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailPage from './pages/EventDetailPage';

const AppContent = () => {
  const { setUser } = useUser(); // Now useUser is used within a component wrapped by UserProvider

  useEffect(() => {
    // Retrieve the user from Local Storage when the component mounts
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [setUser]);

  return (
    <Container component="main" maxWidth="sm">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route exact path="/events" element={<EventsPage />} />
        <Route exact path="/create-event" element={<CreateEventPage />} />
        <Route exact path="/event/:eventId" element={<EventDetailPage />} />
        {/* Add other routes here */}
      </Routes>
    </Container>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <CssBaseline />
        <AppContent />
        <ToastContainer />
      </Router>
    </UserProvider>
  );
}

export default App;