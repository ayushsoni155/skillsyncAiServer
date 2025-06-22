const express = require('express');
const router = express.Router();
const { getReportCard, getLeaderboard } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/report-card', authMiddleware, getReportCard);
router.get('/leaderboard', authMiddleware, getLeaderboard);

module.exports = router;
