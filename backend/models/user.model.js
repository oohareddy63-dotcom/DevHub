const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    endorsements: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    proofs: [{
        type: {
            type: String,
            enum: ['project', 'certificate', 'build_log', 'tutorial'],
            required: true
        },
        title: String,
        description: String,
        url: String,
        image: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const buildLogSchema = new mongoose.Schema({
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    skills: [skillSchema],
    buildLogs: [buildLogSchema],
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        relationship: {
            type: String,
            enum: ['mentor', 'peer', 'mentee', 'collaborator'],
            default: 'peer'
        },
        since: {
            type: Date,
            default: Date.now
        }
    }],
    collaborationRequests: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        relationship: {
            type: String,
            enum: ['mentor', 'peer', 'mentee', 'collaborator'],
            default: 'peer'
        },
        message: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    reputation: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    connectionRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
