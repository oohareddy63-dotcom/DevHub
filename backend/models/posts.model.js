const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    likes: [{
        type: String,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
