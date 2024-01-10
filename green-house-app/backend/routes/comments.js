const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User'); 

// GET all Comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;