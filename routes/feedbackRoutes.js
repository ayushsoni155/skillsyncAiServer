const express = require('express')
const router = express.Router();
const { setFeedback , getAllFeedbacks } = require('../controllers/feedbackController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/submit-feedback', authMiddleware, setFeedback);
router.get('/fetch-feedbacks', authMiddleware, getAllFeedbacks);

module.exports = router;
