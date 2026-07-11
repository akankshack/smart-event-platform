const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    View & filter all events
// @route   GET /api/users/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { search, category, status } = req.query;

    let query = {};

    // Filter by search keyword (title/description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get event details
// @route   GET /api/users/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const registeredCount = await Registration.countDocuments({ event: event._id });

    res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        registeredCount,
        availableSlots: Math.max(0, event.capacity - registeredCount)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register for an event
// @route   POST /api/users/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is completed
    if (event.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for a completed event'
      });
    }

    // Check capacity limit
    const registeredCount = await Registration.countDocuments({ event: eventId });
    if (registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Registration full. Event has reached maximum capacity.'
      });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      attendee: userId,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Perform registration
    console.log('REGISTER DEBUG req.user =', req.user);
    console.log('REGISTER DEBUG userId =', userId);
    console.log('REGISTER DEBUG payload =', {
      attendee: userId,
      event: eventId
    });

    const registration = await Registration.create({
      attendee: userId,
      event: eventId
    });

    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: registration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/users/events/:id/register
// @access  Private
exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const registration = await Registration.findOneAndDelete({
      attendee: userId,
      event: eventId
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's registered events
// @route   GET /api/users/my-registrations
// @access  Private
exports.getRegisteredEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({ attendee: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email' }
      })
      .sort({ registeredAt: -1 });

    const cleanRegistrations = registrations.filter((reg) => reg.event !== null);

    res.status(200).json({
      success: true,
      count: cleanRegistrations.length,
      data: cleanRegistrations.map((reg) => reg.event)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};