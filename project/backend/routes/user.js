const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const admin = require('../config/firebase-admin');

// Get current user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    
    res.json({
      id: uid,
      email,
      name: name || email.split('@')[0],
      profilePicture: picture || ''
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { name } = req.body;
    const { uid } = req.user;

    await admin.auth().updateUser(uid, {
      displayName: name
    });

    res.json({
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 