const express = require('express')
const router = express.Router();
const { generateQuiz , result } = require('../controllers/quizController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/generate-quiz', authMiddleware, generateQuiz);
router.post('/result', authMiddleware, result);

module.exports = router;
