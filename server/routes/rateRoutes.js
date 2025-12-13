const express = require('express');
const router = express.Router();
const { calculateRate } = require('../controllers/adminController');

// @route   POST /api/rates/calculate
// @access  Public
router.post('/calculate', calculateRate);

module.exports = router;