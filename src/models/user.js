const mongoose = require('mongoose');

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
  }
});

// Hash password before saving to the database
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
