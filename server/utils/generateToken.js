const jwt = require('jsonwebtoken');

const generateToken = (id, isAdmin) => {
    return jwt.sign(
        { id, isAdmin }, // Payload: includes user ID and role for authorization
        process.env.JWT_SECRET,
        {
            expiresIn: '30d', // Token expires in 30 days
        }
    );
};

module.exports = generateToken;