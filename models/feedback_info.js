const mongoose = require('mongoose');

const feedbackInfoSchema = new mongoose.Schema({
  feedbackID: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  feedback_msg: { type: String, required: true },
  feedbackDatetime: { type: Date, required: true }
});

module.exports = mongoose.model('feedbackInfo', feedbackInfoSchema);