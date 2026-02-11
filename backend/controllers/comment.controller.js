const Comment = require('../models/comments.model');
const Post = require('../models/posts.model');

// Add Comment
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.postId;

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const post = await Post.findById(postId);
        if (!post || post.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = new Comment({
            userId: req.user.userId,
            postId,
            text
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

// Get Comments for Post
exports.getComments = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if (!post || post.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = await Comment.find({ postId })
            .populate('userId', 'name profilePic')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
