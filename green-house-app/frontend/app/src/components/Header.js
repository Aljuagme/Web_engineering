// frontend/src/components/Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from '../contexts/UserContext'; // Import the useUser hook
import axiosInstance from '../services/axiosInstance'; 
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [userData, setUserData] = useState({ email: '', score: 0 });

  const handleUserIconClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
    fetchUserData();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    handleUserMenuClose(); // Close the menu
    navigate('/'); // Navigate to the home route
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.post('/api/users/profile', { userId: user._id }); // Adjust as per your API endpoint
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., maybe show a message or logout the user)
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={() => navigate(-1)} // This will navigate to the previous page in the history stack
          sx={{ marginRight: 2 }} // Add some margin between the icon and title
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {user && (
            <>
                <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserIconClick}
                >
                <AccountCircleIcon />
                {user.username && (
                <Typography variant="subtitle1" component="span" sx={{ ml: 1 }}>
                    {user.username}
                </Typography>
                )}
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={userMenuAnchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',     // Align the top of the popover with the bottom of the anchor element
                        horizontal: 'right',    // Align the menu to the left of the anchor element
                    }}
                    getContentAnchorEl={null} // This is important to allow anchorOrigin to work
                    transformOrigin={{
                        vertical: 'top',        // Transform origin is set such that the popover animates out from the top
                        horizontal: 'right',
                    }}
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                    MenuListProps={{ 'aria-labelledby': 'account-button' }} // Accessibility feature
                    >
                    <MenuItem onClick={handleUserMenuClose}>
                        <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Email: {userData.email}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleUserMenuClose}>
                        <ListItemIcon>
                        <StarBorderIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Score: {userData.score}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;