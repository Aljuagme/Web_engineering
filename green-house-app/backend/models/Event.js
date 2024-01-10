const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isResolved: { type: Boolean, default: false },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'  // This should match the model name you used when you called mongoose.model('Comment', commentSchema)
  }]
});

module.exports = mongoose.model('Event', eventSchema);