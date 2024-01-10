import React, { useState } from 'react';
import { Typography, Button, TextField, Grid, Link, Paper } from '@mui/material';
import axiosInstance from '../services/axiosInstance'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const RecyclePage = () => {

  return (
    <form method="post" action="{% url 'query_objects' %}">
        <label for="object_name">Object Name:</label>
        {/* <input type="text" name="object_name" value="Beer" readonly> */}
        <button type="submit">Query</button>
    </form>
  );
};

export default RecyclePage;