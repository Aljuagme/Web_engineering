require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/events');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 5001;

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/events', eventRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`Backend listening on port ${port}!`));