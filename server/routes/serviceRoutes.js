// server/routes/serviceRoutes.js
// a separate public endpoint for the customer-facing site to fetch services.

const express = require('express');
const router = express.Router();
const { getPublicServices } = require('../controllers/adminController'); // Re-use the function

// @route   GET /api/services
// @access  Public
router.get('/', getPublicServices);

module.exports = router;