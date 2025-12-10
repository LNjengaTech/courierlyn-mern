// Check for a valid JWT in the request headers.
// Verify the token's authenticity and expiration.
// Extract the user's ID and role (isAdmin) and attach them to the request object (req.user), allowing the controller to know who is making the request.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect general authenticated routes (for both User and Admin)
const protect = async (req, res, next) => {
    let token;

    // 1. Check if the token exists in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: 'Bearer <token>')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 3. Attach the user object (excluding the password) to the request
            // We use .select('-password') to ensure we don't accidentally expose the hash
            req.user = await User.findById(decoded.id).select('-password');

            // 4. Proceed to the next middleware/controller
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Middleware to restrict access only to users with isAdmin: true
const admin = (req, res, next) => {
    // This assumes the `protect` middleware has already run and attached `req.user`
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed
    } else {
        // Forbidden status
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };