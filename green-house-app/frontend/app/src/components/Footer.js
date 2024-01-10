// frontend/src/components/Footer.js
import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Footer = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    // const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
    //   onChange={(event, newValue) => {
    //     setValue(newValue);
    //   }}
      showLabels
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
    >
      <BottomNavigationAction label="Daily Tip" icon={<TipsAndUpdatesIcon />} />
      <BottomNavigationAction label="Recycling" icon={<EventNoteIcon />} />
      {user && (
        <BottomNavigationAction 
          label="Create Event" 
          icon={<AddCircleOutlineIcon />} 
          onClick={() => navigate('/create-event')} 
        />
      )}
    </BottomNavigation>
  );
};

export default Footer;