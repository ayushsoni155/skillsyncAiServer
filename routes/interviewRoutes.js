const express = require('express')
const router = express.Router();
const { startInterview, processAnswer, evaluate } = require('../controllers/interviewController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/start-Interview', authMiddleware, startInterview);
router.post('/process-next', authMiddleware, processAnswer);
router.post('/evaluate',authMiddleware,evaluate);

module.exports = router;
