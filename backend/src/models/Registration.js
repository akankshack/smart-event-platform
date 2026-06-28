const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Enforce compound uniqueness so a user can register for an event only once
RegistrationSchema.index({ attendee: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
