// server/controllers/contactController.js
const QuoteRequest = require('../models/QuoteRequest');
const nodemailer = require('nodemailer');

// --- Nodemailer Setup (Placeholder - replace with your actual configuration) ---
// You should get these credentials from environment variables (e.g., .env)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Admin email address
        pass: process.env.SMTP_PASS, // Admin email password/app key
    },
});


// @desc    Handle general email form submission (sends email to admin)
// @route   POST /api/contact/email
// @access  Public
const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, Email, and Message are required.' });
    }

    try {
        const mailOptions = {
            from: process.env.ADMIN_EMAIL, // Admin's own email
            to: process.env.ADMIN_EMAIL,   // Send email to Admin
            replyTo: email,                // Set reply-to to the sender's email
            subject: `NEW CONTACT: ${subject || 'General Inquiry'}`,
            html: `
                <h3>New Contact Message</h3>
                <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        };

        // Comment out line below while testing if you haven't configured Nodemailer yet
        await transporter.sendMail(mailOptions); 

        res.status(200).json({ message: 'Message sent successfully. We will be in touch soon!' });

    } catch (error) {
        console.error('Email Send Error:', error);
        res.status(500).json({ message: 'Server error sending email. Please try again later.' });
    }
};


// @desc    Handle quote form submission (saves to MongoDB AND notifies admin)
// @route   POST /api/contact/quote
// @access  Public
const createQuoteRequest = async (req, res) => {
    const { name, email, phone, industry, shipFrom, shipTo, category, description } = req.body;

    if (!name || !email || !shipFrom || !shipTo || !category || !description) {
        return res.status(400).json({ message: 'Missing required fields for a quote request.' });
    }

    try {
        const quoteRequest = new QuoteRequest({
            name, email, phone, industry, shipFrom, shipTo, category, description,
        });

        // 1. Save the quote request to the database
        await quoteRequest.save();

        const quoteAdminUrl = `${process.env.CLIENT_URL}/admin/quotes/${quoteRequest._id}`;

        // 2. Send immediate Admin Notification Email
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: process.env.ADMIN_EMAIL,   
            replyTo: email,                
            subject: `🚨 NEW SHIPPING QUOTE REQUEST - ID: ${quoteRequest._id}`,
            html: `
                <h3>New Quote Request Received!</h3>
                <p>A customer has submitted a detailed quote request via the website.</p>
                <hr>
                <p><strong>Customer:</strong> ${name} &lt;${email}&gt;</p>
                <p><strong>Route:</strong> ${shipFrom} to ${shipTo}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Description:</strong> ${description.substring(0, 100)}...</p>
                <br>
                <p>Review and process this request immediately in the dashboard:</p>
                <a href="${quoteAdminUrl}" style="display: inline-block; padding: 10px 20px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px;">
                    View & Respond to Quote
                </a>
            `,
        };

        await transporter.sendMail(mailOptions); // Use the same transporter setup

        res.status(201).json({ message: "Submitted successfully! We'll review & respond shortly." });

    } catch (error) {
        // Note: We send success even if the notification fails, as saving the data is the priority.
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    }
};




//==============================BASIC==============================

// @desc    Handle quote form submission (saves to MongoDB only)
// @route   POST /api/contact/quote
// @access  Public
// const createQuoteRequest = async (req, res) => {
//     const { name, email, phone, industry, shipFrom, shipTo, category, description } = req.body;

//     if (!name || !email || !shipFrom || !shipTo || !category || !description) {
//         return res.status(400).json({ message: 'Missing required fields for a quote request.' });
//     }

//     try {
//         const quoteRequest = new QuoteRequest({
//             name, email, phone, industry, shipFrom, shipTo, category, description,
//         });

//         await quoteRequest.save();

//         res.status(201).json({ message: 'Quote request submitted successfully! We will review and respond shortly.' });

//     } catch (error) {
//         console.error('Quote Save Error:', error);
//         res.status(500).json({ message: 'Server error submitting quote. Please try again later.' });
//     }
// };

module.exports = { sendContactEmail, createQuoteRequest };