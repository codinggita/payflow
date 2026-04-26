const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: function() {
      // Password is only required if the user did not sign up via Google
      return !this.isGoogleAuth;
    },
  },
  isGoogleAuth: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
