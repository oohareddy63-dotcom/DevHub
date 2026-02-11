const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error Connecting to MongoDB", err);
    });

// Import Routes
const authRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/posts.routes');
const commentRoutes = require('./routes/comment.routes');
const buildLogRoutes = require('./routes/buildlog.routes');

// Use Routes - Updated to match master prompt specifications
app.use('/api/auth', authRoutes); // Auth & User routes
app.use('/api/posts', postRoutes); // Post routes
app.use('/api/comments', commentRoutes); // Comment routes
app.use('/api/buildlogs', buildLogRoutes); // Build Log routes


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
