const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In a real app, passwords should be hashed
  score: { type: Number, default: 0 }, // Score property initialized to 0
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);