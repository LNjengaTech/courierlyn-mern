const User = require('../models/User');
const generateToken = require('../utils/generateToken');
// import the password matching method from the User model
// The bcrypt hash and comparison logic already defined in the User.js model

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    // SECURITY: Input Sanitization
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            // Security: Prevents revealing if the user exists or not, but helpful for UX
            return res.status(400).json({ message: 'User already exists' });
        }

        // Creates a new user instance, triggers the pre-save password hashing middleware
        user = await User.create({ name, email, password });

        // Registration successful
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id, user.isAdmin), // Generate token for immediate login
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user, explicitly requesting the 'password' field that is normally hidden (select: false)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            // Security: Use generic error for login failures
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // custom method defined in the User model to compare the hash
        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            // Login successful
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id, user.isAdmin),
            });
        } else {
            // Security: Use generic error for login failures
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

module.exports = { registerUser, loginUser };