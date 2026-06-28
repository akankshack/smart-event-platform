const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If the deleted user is an organizer, we delete their events & registrations
    if (user.role === 'Organizer') {
      const organizerEvents = await Event.find({ organizer: userId });
      const eventIds = organizerEvents.map(e => e._id);
      
      await Registration.deleteMany({ event: { $in: eventIds } });
      await Event.deleteMany({ organizer: userId });
    }

    // Also delete any registrations made by this user as an Attendee
    await Registration.deleteMany({ attendee: userId });

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: 'User and all related records deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system dashboard statistics
// @route   GET /api/admin/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    
    // Upcoming events count
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });

    let responseData = {
      totalEvents,
      totalRegistrations,
      upcomingEvents
    };

    // If user is Admin, add total users count
    if (req.user.role === 'Admin') {
      const totalUsers = await User.countDocuments();
      responseData.totalUsers = totalUsers;
    }

    // If user is Organizer, filter the counts to only apply to their events
    if (req.user.role === 'Organizer') {
      const myEvents = await Event.find({ organizer: req.user.id });
      const myEventIds = myEvents.map(e => e._id);
      
      responseData.myEventsCount = myEvents.length;
      responseData.myRegistrationsCount = await Registration.countDocuments({ event: { $in: myEventIds } });
      responseData.myUpcomingEventsCount = await Event.countDocuments({ 
        organizer: req.user.id, 
        status: 'Upcoming' 
      });
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
