const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: '{VALUE} is not a valid gender'
      },
      required: [true, 'Gender is required']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[\d\s-]+$/, 'Please enter a valid phone number']
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [0, 'Height cannot be negative']
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight cannot be negative']
    },
    emergencyNumber: {
      type: String,
      required: [true, 'Emergency contact number is required'],
      trim: true,
      match: [/^\+?[\d\s-]+$/, 'Please enter a valid emergency contact number']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);