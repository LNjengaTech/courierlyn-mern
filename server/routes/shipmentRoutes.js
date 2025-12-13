const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); //authentication middleware
const { getUserShipments } = require('../controllers/shipmentController');

// --- Private User Routes---
// @route   GET /api/shipments/my
// @desc    Get all shipments belonging to the logged-in user
// @access  Private
router.route('/my').get(protect, getUserShipments);

module.exports = router;








//--------------------------------------------------------------------------------------

//          DUPLICATE FOR TRACKING ROUTES. PENDING FINAL DECISION

//----------------------------------------------------------------------------
// const express = require('express');
// const router = express.Router();
// const { getTrackingDetails } = require('../controllers/shipmentController');

// // Public route for tracking
// router.route('/tracking/:trackingNumber').get(getTrackingDetails);

