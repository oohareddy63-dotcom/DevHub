const User = require('../models/user.model');
const PDFDocument = require('pdfkit');
const upload = require('../middleware/upload.middleware');

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { bio, skills, workHistory, profilePic } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (bio) user.bio = bio;
        if (skills) user.skills = skills;
        if (workHistory) user.workHistory = workHistory;
        if (profilePic) user.profilePic = profilePic;

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update user profile picture with file path
        user.profilePic = `/uploads/profile-pics/${req.file.filename}`;
        await user.save();

        res.json({ message: "Profile picture uploaded successfully", profilePic: user.profilePic });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User (public profile)
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get All Users (for discovery)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.userId } }).select('name username profilePicture bio'); // Exclude current user
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Connection Request Logic
exports.sendConnectionRequest = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user.userId;

        if (targetUserId === currentUserId) {
            return res.status(400).json({ message: "Cannot send connection request to yourself" });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        const currentUser = await User.findById(currentUserId);

        // Check if already connected or request sent
        if (currentUser.connections.includes(targetUserId)) {
            return res.status(400).json({ message: "Already connected" });
        }

        if (targetUser.connectionRequests.includes(currentUserId)) {
            return res.status(400).json({ message: "Connection request already sent" });
        }

        // Add to target user's connection requests
        targetUser.connectionRequests.push(currentUserId);
        await targetUser.save();

        res.json({ message: "Connection request sent" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Accept Connection Request
exports.acceptConnectionRequest = async (req, res) => {
    try {
        const requesterId = req.params.userId;
        const currentUserId = req.user.userId;

        const currentUser = await User.findById(currentUserId);
        const requester = await User.findById(requesterId);

        if (!currentUser || !requester) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        const requestIndex = currentUser.connectionRequests.indexOf(requesterId);
        if (requestIndex === -1) {
            return res.status(400).json({ message: "No connection request found" });
        }

        // Remove from connection requests
        currentUser.connectionRequests.splice(requestIndex, 1);

        // Add to connections for both users
        currentUser.connections.push(requesterId);
        requester.connections.push(currentUserId);

        await currentUser.save();
        await requester.save();

        res.json({ message: "Connection request accepted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reject Connection Request
exports.rejectConnectionRequest = async (req, res) => {
    try {
        const requesterId = req.params.userId;
        const currentUserId = req.user.userId;

        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        const requestIndex = currentUser.connectionRequests.indexOf(requesterId);
        if (requestIndex === -1) {
            return res.status(400).json({ message: "No connection request found" });
        }

        // Remove from connection requests
        currentUser.connectionRequests.splice(requestIndex, 1);
        await currentUser.save();

        res.json({ message: "Connection request rejected" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Connections
exports.getConnections = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('connections', 'name profilePic bio')
            .select('-password');
        
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.json(user.connections);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Connection Requests
exports.getConnectionRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('connectionRequests', 'name profilePic bio')
            .select('-password');
        
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.json(user.connectionRequests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Discover Users
exports.discoverUsers = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const { search } = req.query;

        let query = {
            _id: { $ne: currentUserId },
            connections: { $ne: currentUserId },
            connectionRequests: { $ne: currentUserId }
        };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const users = await User.find(query)
            .select('name profilePic bio skills')
            .limit(20);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Generate Resume PDF
exports.generateResume = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create PDF document
        const doc = new PDFDocument();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${user.name.replace(/\s+/g, '_')}_resume.pdf`);

        // Pipe PDF to response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text(`${user.name}'s Resume`, { align: 'center' });
        doc.moveDown();
        
        if (user.bio) {
            doc.fontSize(14).text('About:', { underline: true });
            doc.fontSize(12).text(user.bio);
            doc.moveDown();
        }

        if (user.skills && user.skills.length > 0) {
            doc.fontSize(14).text('Skills:', { underline: true });
            doc.fontSize(12).text(user.skills.join(', '));
            doc.moveDown();
        }

        if (user.workHistory && user.workHistory.length > 0) {
            doc.fontSize(14).text('Work Experience:', { underline: true });
            user.workHistory.forEach((exp, index) => {
                doc.fontSize(12).text(`${exp.position} at ${exp.company}`);
                if (exp.startDate) {
                    const startDate = new Date(exp.startDate).toLocaleDateString();
                    const endDate = exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString();
                    doc.fontSize(10).text(`${startDate} - ${endDate}`);
                }
                if (exp.description) {
                    doc.fontSize(10).text(exp.description);
                }
                doc.moveDown();
            });
        }

        // Finalize PDF
        doc.end();
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
