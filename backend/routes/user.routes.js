const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Auth Routes - Updated to match specifications
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);

// Default User Creation (temporary)
router.post('/create-default', authController.createDefaultUser);

// User Profile Routes - Updated to match specifications
router.get('/:id', authMiddleware, userController.getUser);
router.put('/update', authMiddleware, userController.updateUserProfile);
router.post('/upload-profile-pic', authMiddleware, upload.single('profilePic'), userController.uploadProfilePicture);

// Connection Routes - Updated to match specifications
router.post('/connections/request/:userId', authMiddleware, userController.sendConnectionRequest);
router.put('/connections/accept/:userId', authMiddleware, userController.acceptConnectionRequest);
router.put('/connections/reject/:userId', authMiddleware, userController.rejectConnectionRequest);
router.get('/connections', authMiddleware, userController.getConnections);
router.get('/connections/requests', authMiddleware, userController.getConnectionRequests);

// Discover Users - Updated to match specifications
router.get('/discover', authMiddleware, userController.discoverUsers);

// Resume PDF - Updated to match specifications
router.get('/resume/:id', authMiddleware, userController.generateResume);

module.exports = router;
