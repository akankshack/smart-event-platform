const express = require('express');
const router = express.Router();

const {
  createEvent,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  registerForEvent,
  cancelRegistration
} = require('../controllers/eventController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


// ================= PUBLIC ROUTES =================

// Get all events for homepage
router.get('/', getAllEvents);

// Get single event details page
router.get('/:id', getEventById);


// ================= PROTECTED USER ROUTES =================

// Register for an event
router.post('/:id/register', protect, registerForEvent);

// Cancel registration
router.delete('/:id/register', protect, cancelRegistration);


// ================= ORGANIZER / ADMIN ROUTES =================

// Create event
router.post(
  '/',
  protect,
  authorize('Organizer', 'Admin'),
  upload.single('poster'),
  createEvent
);

// Get organizer's own events
router.get(
  '/my-events',
  protect,
  authorize('Organizer', 'Admin'),
  getOrganizerEvents
);

// Update event
router.put(
  '/:id',
  protect,
  authorize('Organizer', 'Admin'),
  upload.single('poster'),
  updateEvent
);

// Delete event
router.delete(
  '/:id',
  protect,
  authorize('Organizer', 'Admin'),
  deleteEvent
);

module.exports = router;