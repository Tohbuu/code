const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', auth, authController.getMe);

module.exports = router;