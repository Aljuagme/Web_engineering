import React, { useState } from 'react';
import { Typography, Button, TextField, Grid, Link, Paper } from '@mui/material';
import axiosInstance from '../services/axiosInstance'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { username, email, password };
      await axiosInstance.post('/api/users/register', newUser);
      navigate('/');
    } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || 'An error occurred during register';
        toast.error(errorMessage);
    }
  };

  return (
    <Paper elevation={6} sx={{ padding: 3, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <form onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          value={username}
          onChange={onChange}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          autoComplete="email"
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
          value={password}
          onChange={onChange}
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RegisterPage;