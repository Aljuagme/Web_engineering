import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance'; 
import { useUser } from '../contexts/UserContext'; 
import { Paper, Button, TextField, Typography, Grid, Box, Link, Divider } from '@mui/material';
import { toast } from 'react-toastify';

const HomePage = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = loginData;

    const onChange = (e) => {
        setLoginData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSignIn = async (event) => {
        event.preventDefault();

        try {
            // Make a post request to the backend login endpoint
            const response = await axiosInstance.post('/api/users/login', {
                email,
                password,
            });

            console.log(response.data.message);
            console.log(response.data.user);
            setUser(response.data.user);

            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/events'); // Redirects to an events page, replace with your desired route
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'An error occurred during login';
            toast.error(errorMessage);
        }
    };

    return (
        <Paper elevation={6} sx={{ padding: 3, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Green House App
          </Typography>
          <form onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email} // Controlled component must have a value
              onChange={onChange} // Attach the onChange handler
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password} // Controlled component must have a value
              onChange={onChange} // Attach the onChange handler
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>

            <Grid container sx={{ my: 2 }}>
              <Grid item xs sx={{ flex: 1 }}>
                <Divider sx={{ mt: 1 }} /> {/* Divider on the left */}
              </Grid>
              <Grid item xs={4}>
                <Typography component="span" variant="subtitle1" sx={{ display: 'block', textAlign: 'center' }}>
                   OR 
                </Typography>
              </Grid>
              <Grid item xs sx={{ flex: 1 }}>
                <Divider sx={{ mt: 1 }} /> {/* Divider on the right */}
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2, mb: 2 }}
              onClick={() => navigate('/events')}
            >
              Login as Guest
            </Button>
          </form>
        </Paper>
      );
};

export default HomePage;