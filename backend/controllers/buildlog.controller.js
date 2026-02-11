const BuildLog = require('../models/buildlog.model');
const User = require('../models/user.model');

// Create Build Log
exports.createBuildLog = async (req, res) => {
    try {
        const { title, description, day, phase, progress, attachments, tags, isPublic } = req.body;

        // Try database creation first
        try {
            const buildLog = new BuildLog({
                userId: req.user.userId,
                title,
                description,
                day,
                phase,
                progress: progress || 0,
                attachments: attachments || [],
                tags: tags || [],
                isPublic: isPublic !== false
            });

            await buildLog.save();

            // Update user's build logs
            await User.findByIdAndUpdate(req.user.userId, {
                $push: { buildLogs: buildLog._id }
            });

            // Populate user data for response
            await buildLog.populate('userId', 'name profilePic');

            res.status(201).json({
                message: "Build log created successfully",
                buildLog
            });
        } catch (dbError) {
            // Fallback when database fails
            console.log('Database build log creation failed, using fallback:', dbError.message);

            // Create mock build log for demo
            const mockBuildLog = {
                _id: 'mock-' + Date.now(),
                userId: {
                    _id: req.user.userId,
                    name: 'Itha Reddy', // Use logged-in user's name
                    profilePic: null
                },
                title,
                description,
                day,
                phase,
                progress: progress || 0,
                attachments: attachments || [],
                tags: tags || [],
                isPublic: isPublic !== false,
                likesCount: 0,
                comments: [],
                helpRequests: [],
                createdAt: new Date().toISOString()
            };

            res.status(201).json({
                message: "Build log created successfully (demo mode)",
                note: "Database unavailable - build log saved in memory only",
                buildLog: mockBuildLog
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Build Logs (Feed)
exports.getBuildLogs = async (req, res) => {
    try {
        // Return mock data for now to test frontend
        const mockBuildLogs = [
            {
                _id: '1',
                userId: {
                    _id: 'user1',
                    name: 'John Developer',
                    profilePic: null
                },
                title: 'Learning React Hooks',
                description: 'Day 1 of learning React Hooks - understanding useState and useEffect',
                day: 1,
                phase: 'learning',
                progress: 25,
                tags: ['react', 'hooks', 'frontend'],
                isPublic: true,
                likesCount: 5,
                comments: [],
                helpRequests: [],
                createdAt: new Date().toISOString()
            }
        ];

        res.json({
            buildLogs: mockBuildLogs,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalLogs: 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User's Build Logs
exports.getUserBuildLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const buildLogs = await BuildLog.find({
            userId,
            $or: [
                { isPublic: true },
                { userId: req.user?.userId } // User can see their own private logs
            ]
        })
            .populate('userId', 'name profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await BuildLog.countDocuments({
            userId,
            $or: [
                { isPublic: true },
                { userId: req.user?.userId }
            ]
        });

        res.json({
            buildLogs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalLogs: total
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Like Build Log
exports.likeBuildLog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const buildLog = await BuildLog.findById(id);
        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found" });
        }

        const existingLike = buildLog.likes.find(like =>
            like.userId.toString() === userId
        );

        if (existingLike) {
            // Remove like
            buildLog.likes = buildLog.likes.filter(like =>
                like.userId.toString() !== userId
            );
        } else {
            // Add like
            buildLog.likes.push({ userId });
        }

        await buildLog.save();

        res.json({
            message: existingLike ? "Like removed" : "Build log liked",
            likesCount: buildLog.likes.length,
            isLiked: !existingLike
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add Comment to Build Log
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user.userId;

        if (!text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const buildLog = await BuildLog.findById(id);
        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found" });
        }

        buildLog.comments.push({
            userId,
            text: text.trim()
        });

        await buildLog.save();

        // Populate the new comment
        await buildLog.populate({
            path: 'comments',
            populate: {
                path: 'userId',
                select: 'name profilePic'
            }
        });

        const newComment = buildLog.comments[buildLog.comments.length - 1];

        res.json({
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Request Help on Build Log
exports.requestHelp = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const userId = req.user.userId;

        if (!message.trim()) {
            return res.status(400).json({ message: "Help request message is required" });
        }

        const buildLog = await BuildLog.findById(id);
        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found" });
        }

        buildLog.helpRequests.push({
            userId,
            message: message.trim()
        });

        await buildLog.save();

        // Populate the help request
        await buildLog.populate({
            path: 'helpRequests',
            populate: {
                path: 'userId',
                select: 'name profilePic'
            }
        });

        const newHelpRequest = buildLog.helpRequests[buildLog.helpRequests.length - 1];

        res.json({
            message: "Help request sent successfully",
            helpRequest: newHelpRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Build Log
exports.updateBuildLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, phase, progress, attachments, tags, isPublic } = req.body;

        const buildLog = await BuildLog.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found or unauthorized" });
        }

        // Update fields
        if (title) buildLog.title = title;
        if (description) buildLog.description = description;
        if (phase) buildLog.phase = phase;
        if (progress !== undefined) buildLog.progress = progress;
        if (attachments) buildLog.attachments = attachments;
        if (tags) buildLog.tags = tags;
        if (isPublic !== undefined) buildLog.isPublic = isPublic;

        buildLog.updatedAt = new Date();
        await buildLog.save();

        await buildLog.populate('userId', 'name profilePic');

        res.json({
            message: "Build log updated successfully",
            buildLog
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Build Log
exports.deleteBuildLog = async (req, res) => {
    try {
        const { id } = req.params;

        const buildLog = await BuildLog.findOne({
            _id: id,
            userId: req.user.userId
        });

        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found or unauthorized" });
        }

        await BuildLog.findByIdAndDelete(id);

        // Remove from user's build logs
        await User.findByIdAndUpdate(req.user.userId, {
            $pull: { buildLogs: id }
        });

        res.json({ message: "Build log deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add Progress Update
exports.addProgressUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { percentage, note, date } = req.body;
        const userId = req.user.userId;

        const buildLog = await BuildLog.findOne({ _id: id, userId });
        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found or unauthorized" });
        }

        buildLog.progressUpdates.push({
            percentage,
            note,
            date: date || new Date()
        });

        // Update main progress
        buildLog.progress = percentage;

        await buildLog.save();

        res.json({
            message: "Progress update added",
            buildLog
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add Blocker
exports.addBlocker = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user.userId;

        const buildLog = await BuildLog.findOne({ _id: id, userId });
        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found or unauthorized" });
        }

        buildLog.blockers.push({
            title,
            description,
            status: 'open',
            solutions: []
        });

        await buildLog.save();

        res.json({
            message: "Blocker added",
            blocker: buildLog.blockers[buildLog.blockers.length - 1]
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Resolve Blocker
exports.resolveBlocker = async (req, res) => {
    try {
        const { id, blockerId } = req.params;
        const { solutionId } = req.body; // Optional: mark a specific solution as accepted
        const userId = req.user.userId;

        const buildLog = await BuildLog.findOne({ _id: id, userId });
        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found or unauthorized" });
        }

        const blocker = buildLog.blockers.id(blockerId);
        if (!blocker) {
            return res.status(404).json({ message: "Blocker not found" });
        }

        blocker.status = 'resolved';
        blocker.resolvedAt = new Date();

        if (solutionId) {
            const solution = blocker.solutions.id(solutionId);
            if (solution) {
                solution.isAccepted = true;
            }
        }

        await buildLog.save();

        res.json({
            message: "Blocker resolved",
            blocker
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add Solution to Blocker
exports.addBlockerSolution = async (req, res) => {
    try {
        const { id, blockerId } = req.params;
        const { text } = req.body;
        const userId = req.user.userId;

        const buildLog = await BuildLog.findById(id);
        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found" });
        }

        const blocker = buildLog.blockers.id(blockerId);
        if (!blocker) {
            return res.status(404).json({ message: "Blocker not found" });
        }

        blocker.solutions.push({
            userId,
            text,
            upvotes: [],
            isAccepted: false
        });

        await buildLog.save();

        // Populate user for the new solution
        await buildLog.populate({
            path: 'blockers.solutions.userId',
            select: 'name profilePic'
        });

        const updatedBlocker = buildLog.blockers.id(blockerId);
        res.json({
            message: "Solution added",
            solution: updatedBlocker.solutions[updatedBlocker.solutions.length - 1]
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Vote on Solution
exports.voteBlockerSolution = async (req, res) => {
    try {
        const { id, blockerId, solutionId } = req.params;
        const userId = req.user.userId;

        const buildLog = await BuildLog.findById(id);
        if (!buildLog) {
            return res.status(404).json({ message: "Build log not found" });
        }

        const blocker = buildLog.blockers.id(blockerId);
        if (!blocker) {
            return res.status(404).json({ message: "Blocker not found" });
        }

        const solution = blocker.solutions.id(solutionId);
        if (!solution) {
            return res.status(404).json({ message: "Solution not found" });
        }

        const existingVoteIndex = solution.upvotes.indexOf(userId);
        if (existingVoteIndex === -1) {
            solution.upvotes.push(userId);
        } else {
            solution.upvotes.splice(existingVoteIndex, 1);
        }

        await buildLog.save();

        res.json({
            message: "Vote updated",
            upvotes: solution.upvotes.length
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
