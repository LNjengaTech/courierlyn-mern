const mongoose = require('mongoose');

const quoteRequestSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        industry: {
            type: String,
        },
        shipFrom: {
            type: String, // e.g., 'City, State/ZIP'
            required: true,
        },
        shipTo: {
            type: String, // e.g., 'City, State/ZIP'
            required: true,
        },
        category: {
            type: String, // e.g., 'Electronics', 'Perishables', 'General Cargo'
            required: true,
        },
        description: {
            type: String,
            required: true, // Details like weight, dimensions, specific needs
        },
        // Admin tracking field
        isProcessed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema);

module.exports = QuoteRequest;