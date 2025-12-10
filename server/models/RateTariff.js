// server/models/RateTariff.js

const mongoose = require('mongoose');

const RateTariffSchema = new mongoose.Schema({
    // 1. Defining the Rate Scope
    serviceType: { // Must match a service name (e.g., 'Express', 'Standard', 'International Freight')
        type: String,
        required: [true, 'Service type is required'],
        trim: true,
    },
    originZone: { // e.g., 'Zone A' (Local), 'USA', 'EU'
        type: String,
        required: [true, 'Origin zone is required'],
        trim: true,
    },
    destinationZone: { // e.g., 'Zone B' (Inter-state), 'Asia', 'Africa'
        type: String,
        required: [true, 'Destination zone is required'],
        trim: true,
    },
    
    // 2. Defining the Pricing Brackets
    minWeight: {
        type: Number,
        required: true,
        default: 0
    },
    maxWeight: {
        type: Number,
        required: true,
        // Using a large number for the last bracket (or 0 for max)
        default: 999999 
    },
    
    // 3. Cost Components
    baseCost: { // Flat fee for the shipment
        type: Number,
        required: true,
        default: 0.00
    },
    costPerUnit: { // Price multiplier for the weight unit (e.g., cost per kg/lb)
        type: Number,
        required: true,
        default: 0.00
    },
    
    // 4. Rate Metadata
    isActive: {
        type: Boolean,
        default: true
    },
    effectiveDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensure unique combination of service, origin, and weight range to prevent overlap
RateTariffSchema.index({ serviceType: 1, originZone: 1, destinationZone: 1, minWeight: 1 }, { unique: true });

module.exports = mongoose.model('RateTariff', RateTariffSchema);