// server/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const { sendContactEmail, createQuoteRequest } = require('../controllers/contactController');

// @route   POST /api/contact/email
// @access  Public
router.route('/email').post(sendContactEmail);

// @route   POST /api/contact/quote
// @access  Public
router.route('/quote').post(createQuoteRequest);

module.exports = router;