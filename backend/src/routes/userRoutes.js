const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  registerForEvent, 
  cancelRegistration, 
  getRegisteredEvents 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for viewing events
router.get('/events', getEvents);
router.get('/events/:id', getEventById);

// Private routes for registrations (Any authenticated user role can register)
router.post('/events/:id/register', protect, registerForEvent);
router.delete('/events/:id/register', protect, cancelRegistration);
router.get('/my-registrations', protect, getRegisteredEvents);

module.exports = router;
