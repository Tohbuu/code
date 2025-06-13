const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const userController = require('../controllers/userController');

const router = express.Router();

// Configure Multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/images/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and GIF files are allowed!'));
    }
  }
});

// @route   PUT /api/users
// @desc    Update user profile
router.put('/', auth, userController.updateProfile);

// @route   PUT /api/users/theme
// @desc    Update user theme
router.put('/theme', auth, userController.updateTheme);

// @route   POST /api/users/avatar
// @desc    Upload user avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    const oldAvatar = user.profilePicture;

    // Delete old avatar if it's not the default
    if (oldAvatar !== 'default.png') {
      const oldAvatarPath = path.join(__dirname, '../../public/images/avatars', oldAvatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user with new avatar
    user.profilePicture = req.file.filename;
    await user.save();

    res.json({ 
      success: true, 
      profilePicture: user.profilePicture 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;