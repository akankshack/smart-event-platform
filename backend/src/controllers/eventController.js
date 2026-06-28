const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, venue, capacity } = req.body;

    const defaultImages = {
  Hackathon: "/images/hackathon.jpeg",
  Conference: "/images/conference.jpeg",
  Workshop: "/images/workshop.jpeg",
  Seminar: "/images/seminar.jpeg",
  Webinar: "/images/webinar.jpeg",
  Meetup: "/images/meetup.jpeg",
  Cultural: "/images/cultural.jpeg",
  Sports: "/images/sports.jpeg",
};

let posterImage;

if (req.file) {
  posterImage =
    req.file.path ||
    `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
} else {
  posterImage = defaultImages[category];
}

    const event = await Event.create({
      organizer: req.user.id,
      title,
      description,
      category,
      date,
      time,
      venue,
      capacity: Number(capacity),
      posterImage,
      status: 'Upcoming' // Default status
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get organizer's own events
// @route   GET /api/events/my-events
// @access  Private (Organizer/Admin only)
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({ date: 1 });
    
    // For student portfolio simplicity, aggregate total registration count for each event
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({ event: event._id });
        return {
          ...event.toObject(),
          registrationCount
        };
      })
    );

    res.status(200).json({ success: true, count: events.length, data: eventsWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin only)
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.id || req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify ownership (unless Admin)
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this event' });
    }

    const updates = { ...req.body };
    
    if (req.file) {
      updates.posterImage = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify ownership (unless Admin)
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this event' });
    }

    // Delete all registrations associated with the event
    await Registration.deleteMany({ event: event._id });
    
    // Delete event itself
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Event and associated registrations deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
