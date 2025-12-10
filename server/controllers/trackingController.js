// server/controllers/trackingController.js

const Shipment = require('../models/Shipment');
const TrackingEvent = require('../models/TrackingEvent');

// @desc    Get tracking details by public tracking number
// @route   GET /api/tracking/:trackingNumber
// @access  Public
const getTrackingDetails = async (req, res) => {
    const { trackingNumber } = req.params;

    try {
        // 1. Find the shipment using the trackingNumber
        const shipment = await Shipment.findOne({ trackingNumber });

        if (!shipment) {
            return res.status(404).json({ message: 'Tracking number not found.' });
        }

        // 2. Fetch all tracking events for this shipment, sorted by timestamp (oldest first)
        const trackingHistory = await TrackingEvent.find({ shipment: shipment._id })
            .sort({ timestamp: 1 });
        
        // 3. Optional: Mark the latest event as 'isCurrent' for frontend styling
        if (trackingHistory.length > 0) {
            // Mark the last event (newest) as current
            trackingHistory[trackingHistory.length - 1].isCurrent = true;
        }

        // Return the shipment details and the history
        res.json({ shipment, trackingHistory });

    } catch (error) {
        console.error(`Error fetching tracking details for ${trackingNumber}: ${error.message}`);
        res.status(500).json({ message: 'Server error retrieving tracking information.' });
    }
};

module.exports = {
    getTrackingDetails,
    // ... other exports (e.g., getUserShipments)
};
