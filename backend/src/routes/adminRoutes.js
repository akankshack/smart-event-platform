const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  deleteUser, 
  getDashboardStats 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get stats endpoint - protected but accessible to all roles (handles filters internally)
router.get('/stats', protect, getDashboardStats);

// Admin-only management endpoints
router.get('/users', protect, authorize('Admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
