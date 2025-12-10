const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Personal Information
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true, // Security: removes whitespace from both ends
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please use a valid email address'
        ],
        lowercase: true, // Security: store emails consistently
    },
    // Authentication
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Security: NEVER return the password field in queries
    },
    // Role for Authorization
    isAdmin: {
        type: Boolean,
        default: false, // Default user is a customer
    },
    // Saved addresses for faster booking (Customer Dashboard feature)
    addresses: [{
        street: String,
        city: String,
        country: String,
        zip: String,
        isDefault: { type: Boolean, default: false }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// **SECURITY FEATURE: Password Hashing Middleware**
// Mongoose pre-save hook to hash the password before saving a new user
UserSchema.pre('save', async function() {
    // Only hash if the password field is actually modified (or new)
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// **SECURITY FEATURE: Compare Passwords Method**
// Custom method to compare entered password with the hashed password in the DB
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);