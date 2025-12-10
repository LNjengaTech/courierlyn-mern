const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    // Dynamic content fields
    title: { // e.g., "Parcel Delivery"
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    subtitle: { // Matches the request for a card subtitle
        type: String,
        required: true
    },
    details: { // Full description of the service
        type: String,
        required: true
    },
    // Image Upload (Multer related)
    image: { // Storing the path/URL to the image
        type: String,
        default: '/images/default_service.jpg'
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Service', ServiceSchema);