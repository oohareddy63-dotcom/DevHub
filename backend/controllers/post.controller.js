const Post = require('../models/posts.model');
const User = require('../models/user.model');
const Comment = require('../models/comments.model');

// Create Post
exports.createPost = async (req, res) => {
    try {
        const { text, image } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        const post = new Post({
            userId: req.user.userId,
            text,
            image
        });

        await post.save();
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get All Posts (Feed)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ isDeleted: false })
            .populate('userId', 'name email profilePic')
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'name profilePic' }
            })
            .populate('likes', 'name profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('userId', 'name email profilePic')
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'name profilePic' }
            })
            .populate('likes', 'name profilePic');
        if (!post || post.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Like/Unlike Post
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.userId;

        const post = await Post.findById(postId);
        if (!post || post.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(userId);
        }

        await post.save();
        res.json({ message: likeIndex > -1 ? "Post unliked" : "Post liked", likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Post (Soft Delete)
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user owns the post
        if (post.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        // Soft delete
        post.isDeleted = true;
        await post.save();

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Comment on Post
exports.commentOnPost = async (req, res) => {
    try {
        const { body } = req.body;
        const postId = req.params.id;

        if (!body) return res.status(400).json({ message: "Comment body is required" });

        const post = await Post.findById(postId);
        if (!post || post.isDeleted) return res.status(404).json({ message: "Post not found" });

        const comment = new Comment({
            userId: req.user.userId,
            postId,
            body
        });

        await comment.save();

        // Populate user data for the comment
        await comment.populate('userId', 'name profilePic');

        post.comments.push(comment._id);
        await post.save();

        res.status(201).json({ message: "Comment added", comment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
