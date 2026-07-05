const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Default poster images
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

// ================= CREATE EVENT =================
// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, venue, capacity } = req.body;

    let posterImage;

    if (req.file) {
      posterImage =
        req.file.path ||
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    } else {
      posterImage = defaultImages[category] || "/images/default-event.jpeg";
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
      status: "Upcoming",
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL EVENTS =================
// @desc    Get all events for public homepage
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .sort({ date: 1 });

    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registeredCount = await Registration.countDocuments({ event: event._id });
        const availableSlots = Math.max((event.capacity || 0) - registeredCount, 0);

        return {
          ...event.toObject(),
          registeredCount,
          availableSlots,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: eventsWithStats.length,
      data: eventsWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE EVENT =================
// @desc    Get single event details
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const registeredCount = await Registration.countDocuments({ event: event._id });
    const availableSlots = Math.max((event.capacity || 0) - registeredCount, 0);

    res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        registeredCount,
        availableSlots,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= REGISTER FOR EVENT =================
// @desc    Register logged-in user for an event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: req.params.id,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Check available slots
    const registeredCount = await Registration.countDocuments({ event: req.params.id });
    if (registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: "Event is full",
      });
    }

    await Registration.create({
      user: req.user.id,
      event: req.params.id,
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered for event",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= CANCEL REGISTRATION =================
// @desc    Cancel logged-in user's event registration
// @route   DELETE /api/events/:id/register
// @access  Private
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user.id,
      event: req.params.id,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    await Registration.findByIdAndDelete(registration._id);

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ORGANIZER EVENTS =================
// @desc    Get organizer's own events
// @route   GET /api/events/my-events
// @access  Private (Organizer/Admin only)
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({ date: 1 });

    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({ event: event._id });
        return {
          ...event.toObject(),
          registrationCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: events.length,
      data: eventsWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE EVENT =================
// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin only)
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to edit this event",
      });
    }

    const updates = { ...req.body };

    if (req.file) {
      updates.posterImage =
        req.file.path ||
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE EVENT =================
// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this event",
      });
    }

    await Registration.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event and associated registrations deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};