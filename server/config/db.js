const mongoose = require('mongoose');

// Get the connection string from the environment variables
const db = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;