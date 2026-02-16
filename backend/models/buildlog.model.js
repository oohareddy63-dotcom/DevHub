const mongoose = require('mongoose');

const buildLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    phase: {
        type: String,
        enum: ['learning', 'building', 'testing', 'deployment', 'troubleshooting'],
        required: true
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'code', 'link', 'screenshot']
        },
        url: String,
        caption: String
    }],
    tags: [String],
    helpRequests: [{
        userId: {
            type: String,
            ref: 'User'
        },
        message: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    likes: [{
        userId: {
            type: String,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        userId: {
            type: String,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    progressUpdates: [{
        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        note: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    blockers: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['open', 'resolved'],
            default: 'open'
        },
        solutions: [{
            userId: {
                type: String,
                ref: 'User'
            },
            text: {
                type: String,
                required: true
            },
            upvotes: [{
                type: String,
                ref: 'User'
            }],
            isAccepted: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        },
        resolvedAt: Date
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BuildLog', buildLogSchema);
