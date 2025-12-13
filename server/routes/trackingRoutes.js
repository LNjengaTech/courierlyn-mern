const express = require('express');
const router = express.Router();
const { getTrackingDetails } = require('../controllers/trackingController');

// Public route for tracking
router.route('/:trackingNumber').get(getTrackingDetails);

module.exports = router;