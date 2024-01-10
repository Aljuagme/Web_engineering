const express = require('express');
const multer = require('multer');
const path = require('path'); 
const router = express.Router();
const Event = require('../models/Event');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this uploads directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('image'), async (req, res) => {
  const { title, description, location, createdBy } = req.body; // Assuming createdBy holds the user's ID

  // req.file contains the image file information since 'image' is the field name
  const imagePath = req.file ? req.file.path : null;

  try {
    // Create an Event with the image path and other data
    const newEvent = new Event({
      title,
      description,
      location,
      createdBy, // Placeholder until authentication is added
      image: imagePath // Save image path in the Event document
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event.' });
  }
});

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({}).populate('createdBy', 'username').sort({ createdDate: -1 }).exec(); // Populate the createdBy field with the username from User model

    const eventsWithImageUrl = events.map(event => {
      // Assuming you're hosting your images on the same server under the 'uploads' directory
      const imageUrl = event.image ? `${req.protocol}://${req.get('host')}/${event.image}` : '';
      
      return {
        ...event.toObject(),
        image: imageUrl,
        location: event.location, // Assuming location is an array [latitude, longitude]
      };
    });

    res.json(eventsWithImageUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
});

// GET /api/events/:eventId - Get event details by ID
router.get('/:eventId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'User'
        }
      });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const user = await User.findById(event.createdBy);
    res.json({
      ...event.toObject(),
      // We don't spread the 'createdBy' directly because it may contain sensitive information
      createdBy: user,
      image: event.image ? `${req.protocol}://${req.get('host')}/${event.image}` : ''
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching event details' });
  }
});

// POST /api/events/:eventId/resolve - Mark an event as resolved and increment score
router.post('/:eventId/resolve', async (req, res) => {
  try {
    // Assuming `req.userId` contains the authenticated user's ID
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.isResolved) {
      return res.status(400).json({ message: 'Event is already resolved' });
    }

    console.log("req.body.userId", req.body.userId);
    const user = await User.findById(req.body.userId);
    if (user) {
      user.score += 1; // Increment the user's score
      await user.save();
    } else {
      return res.status(404).json({ message: 'User not found' });
    }

    event.isResolved = true;
    await event.save();

    res.json({ message: 'Event resolved', event, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error resolving event' });
  }
});

// POST /api/events/:eventId/comments - Add a comment to an event
router.post('/:eventId/comments', async (req, res) => {
  try {
    const { content, author } = req.body;
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Assuming the user authentication is handled and the author ID is available
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new comment and associate it with the event
    const newComment = new Comment({
      content,
      author: user._id, // or simply `author` if it's already the user's ID
      event: event._id,
      createdAt: new Date()
    });

    // Save the comment to the database
    await newComment.save();
    const populatedComment = await newComment.populate('author');

    // Push the comment to the event's comments array
    event.comments.unshift(newComment); // Add the new comment to the beginning of the array
    await event.save();

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

module.exports = router;