const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const {
  register,
  login,
  getUserProfile,
  updateProfile
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateProfile);

module.exports = router; 