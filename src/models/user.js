const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
 
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  image: {
    url: {
      type: String, // URL of the image stored in Cloudinary
      required: false,
    },
    publicId: {
      type: String, // Cloudinary public ID for the image
      required: false,
    },
  },
  refreshToken: {
    type: String,
    default: null,
  },
  refreshOTP: {
    type: String,
    default: null,
  },
});

// Hash password before saving to the database
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  const token = crypto.randomBytes(32).toString('hex'); // Generate a secure token
  this.refreshToken = token;
  return token;
};

userSchema.methods.generateRefreshOtp = function () {
  const OTP = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit random number
  this.refreshOTP= OTP.toString(); // Store as a string if needed
  return this.refreshOTP;
};

// Clear Refresh Token
userSchema.methods.clearRefreshToken = function () {
  this.refreshToken = null;
};
// Clear Refresh OTP
userSchema.methods.clearRefreshOtp = function () {
  this.refreshPTO = null;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
