const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time']
  },
  venue: {
    type: String,
    required: [true, 'Please add a venue']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity limit']
  },
  posterImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
