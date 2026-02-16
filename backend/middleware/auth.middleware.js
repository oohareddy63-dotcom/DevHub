const jwt = require('jsonwebtoken');

// Fallback JWT secret if not set in .env (must match auth.controller.js)
const JWT_SECRET = process.env.JWT_SECRET && process.env.JWT_SECRET.trim() ? process.env.JWT_SECRET : 'fallback_secret_change_in_production';

module.exports = (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
