// server/models/Shipment.js

const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    // Unique Identifier
    trackingNumber: {
        type: String,
        required: [true, 'Tracking number is required'],
        unique: true,
        uppercase: true,
        // Typically a standard format (e.g., 10-15 alphanumeric chars)
    },
    
    // Origin & Destination Details
    originCity: { type: String, required: true },
    originCountry: { type: String, required: true },
    destinationCity: { type: String, required: true },
    destinationCountry: { type: String, required: true },

    // Shipment Details
    serviceType: { type: String, required: true }, // e.g., 'Express Air'
    weight: { type: Number, required: true },
    dimensions: { // Stored as a sub-document or object
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
    },
    
    // Status & Dates
    currentStatus: { // High-level status
        type: String,
        enum: ['PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'CANCELLED'],
        default: 'PENDING',
    },
    // The date the package was actually delivered
    deliveryDate: { type: Date }, 
    
    // Relationship (for Customer Dashboard)
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Links the shipment to a registered user
    },

    // Cost
    calculatedRate: { type: Number, required: true },
    currency: { type: String, default: 'USD' },

}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);