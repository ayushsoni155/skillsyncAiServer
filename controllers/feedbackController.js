const feedbackInfo = require('../models/feedback_info');
const generateID = require('../utils/generateID');
const userInfo = require('../models/user_info');

// Submit Feedback
const setFeedback = async (req, res) => {
  const { feedback_msg } = req.body;

  if (!feedback_msg || typeof feedback_msg !== 'string' || feedback_msg.trim() === "") {
    return res.status(400).json({ error: "Feedback message is required and must be a valid string." });
  }

  try {
    const feedback = new feedbackInfo({
      feedbackID: generateID("FD"),
      email: req.user.email,
      feedback_msg,
      feedbackDatetime: new Date()
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackInfo.find().sort({ feedbackDatetime: -1 });

    const emails = feedbacks.map(fb => fb.email);
    const users = await userInfo.find({ email: { $in: emails } });

    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user.profile_url;
    });

    const enrichedFeedbacks = feedbacks.map(fb => ({
      ...fb._doc,
      profile_url: userMap[fb.email] || ""
    }));

    res.status(200).json(enrichedFeedbacks);
  } catch (err) {
    console.error("Feedback fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { setFeedback, getAllFeedbacks };
