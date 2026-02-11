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
router.post('/:id/progress', authMiddleware, buildLogController.addProgressUpdate);
router.post('/:id/blocker', authMiddleware, buildLogController.addBlocker);
router.put('/:id/blocker/:blockerId/resolve', authMiddleware, buildLogController.resolveBlocker);
router.post('/:id/blocker/:blockerId/solution', authMiddleware, buildLogController.addBlockerSolution);
router.put('/:id/blocker/:blockerId/solution/:solutionId/vote', authMiddleware, buildLogController.voteBlockerSolution);
router.delete('/:id', authMiddleware, buildLogController.deleteBuildLog);

module.exports = router;
