const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
const register = async (req, res) => {
  try {
    console.log('Register endpoint hit with data:', req.body);

    const {
      fullName,
      email,
      password,
      dateOfBirth,
      gender,
      phoneNumber,
      height,
      weight,
      emergencyNumber
    } = req.body;

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'password', 'dateOfBirth', 'gender', 'phoneNumber', 'height', 'weight', 'emergencyNumber'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Parse date and validate
    const parsedDate = new Date(dateOfBirth);
    if (isNaN(parsedDate.getTime())) {
      console.log('Invalid date format:', dateOfBirth);
      return res.status(400).json({
        success: false,
        message: 'Invalid date format for dateOfBirth'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      dateOfBirth: parsedDate,
      gender,
      phoneNumber,
      height: Number(height),
      weight: Number(weight),
      emergencyNumber
    };

    console.log('Creating new user with data:', { ...userData, password: '[HIDDEN]' });

    const user = new User(userData);
    await user.save();

    console.log('User saved successfully with ID:', user._id);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration Error:', error);
    // Send more detailed error message in development
    res.status(400).json({
      success: false,
      message: error.message || 'Error registering user',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      phoneNumber,
      height,
      weight,
      emergencyNumber
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (emergencyNumber) user.emergencyNumber = emergencyNumber;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateProfile
}; 