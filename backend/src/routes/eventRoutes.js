const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getOrganizerEvents, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Organizer and Admin only event routes
router.use(protect);
router.use(authorize('Organizer', 'Admin'));

router.post('/', upload.single('poster'), createEvent);
router.get('/my-events', getOrganizerEvents);
router.put('/:id', upload.single('poster'), updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
