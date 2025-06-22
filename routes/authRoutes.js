const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, getUser } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/login', loginUser);
router.get('/logout', authMiddleware, logoutUser);
router.get('/me', authMiddleware, getUser);



module.exports = router;
