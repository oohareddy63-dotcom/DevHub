const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Comment Routes - Updated to match specifications
router.post('/:postId', authMiddleware, commentController.addComment);
router.get('/:postId', authMiddleware, commentController.getComments);

module.exports = router;
