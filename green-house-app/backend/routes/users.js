const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// GET all events
router.get('/', async (req, res) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
        

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user = new User({ username, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: JSON.stringify(error) });
    }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check for user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare given password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    
      // For simplicity, returning a success message for now
      res.json({ message: 'User logged in successfully', user: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/profile - Get the current user's data
router.post('/profile', async (req, res) => {
    try {
      const userId = req.body.userId;
      // Assuming req.userId contains the ID of the authenticated user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Returning minimal and non-sensitive data
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error fetching user data' });
    }
});

module.exports = router;