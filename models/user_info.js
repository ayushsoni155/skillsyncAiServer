const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profile_url: { type: String },
  points: { type: Number, default: 0 }
});

module.exports = mongoose.model('userInfo', userInfoSchema);
