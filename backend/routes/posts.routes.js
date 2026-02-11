const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Post Routes - Updated to match specifications
router.post('/create', authMiddleware, postController.createPost);
router.get('/', authMiddleware, postController.getAllPosts);
router.put('/like/:id', authMiddleware, postController.likePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
