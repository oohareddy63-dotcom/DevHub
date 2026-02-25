const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Trust proxy - REQUIRED for Render deployment
// This allows express-rate-limit to work correctly behind Render's proxy
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(morgan('combined'));

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://devhub-frontend.onrender.com',
    'https://devhub-12.onrender.com',
    'https://hub3.onrender.com',
    'https://hub-i7dr.onrender.com',
    process.env.FRONTEND_URL // Allow custom frontend URL from env
].filter(Boolean); // Remove undefined values

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any onrender.com subdomain in production
        if (origin && origin.includes('.onrender.com')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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

// Health check endpoint (works without MongoDB)
app.get('/api/health', (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        message: 'Backend server is running',
        mongodb: mongoStatus,
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'DevHub API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth/*',
            posts: '/api/posts/*',
            comments: '/api/comments/*',
            buildlogs: '/api/buildlogs/*'
        }
    });
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

// 404 handler - helps debug routing issues
app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.path);
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        path: req.path,
        message: 'Please check the API documentation. All routes should start with /api'
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
