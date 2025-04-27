// models/User.js

const mongoose = require('mongoose');  // Only declare once

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },   // hashed password
  name:     { type: String, required: true },
  email:    { type: String },                 // optional
  created:  { type: Date,   default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
