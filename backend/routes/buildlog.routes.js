const express = require('express');
const router = express.Router();
const buildLogController = require('../controllers/buildlog.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Build Log Routes
router.post('/create', authMiddleware, buildLogController.createBuildLog);
router.get('/', buildLogController.getBuildLogs); // Public feed
router.get('/user/:userId', buildLogController.getUserBuildLogs);
router.put('/like/:id', authMiddleware, buildLogController.likeBuildLog);
router.post('/comment/:id', authMiddleware, buildLogController.addComment);
router.post('/help/:id', authMiddleware, buildLogController.requestHelp);
router.put('/:id', authMiddleware, buildLogController.updateBuildLog);
router.delete('/:id', authMiddleware, buildLogController.deleteBuildLog);

module.exports = router;
