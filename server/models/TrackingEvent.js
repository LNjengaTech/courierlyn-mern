// server/models/TrackingEvent.js

const mongoose = require('mongoose');

const trackingEventSchema = new mongoose.Schema({
    // Link to the Parent Shipment
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
        required: true,
    },
    
    // Event Details
    location: { // City, Country where the event occurred
        type: String,
        required: true,
    },
    status: { // Detailed description of the event
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isCurrent: { // Flag to quickly identify the latest status event
        type: Boolean,
        default: false,
    },
    
    // Optional details
    // e.g., signature proof, exception reason, customs clearance status
    details: { type: String },

}, { timestamps: true });

// Index for quick lookups by shipment and sort by time
trackingEventSchema.index({ shipment: 1, timestamp: -1 });

module.exports = mongoose.model('TrackingEvent', trackingEventSchema);