const Service = require('../models/Service');
const mongoose = require('mongoose');
const User = require('../models/User');
const RateTariff = require('../models/RateTariff');
const Shipment = require('../models/Shipment');
const TrackingEvent = require('../models/TrackingEvent');
const QuoteRequest = require('../models/QuoteRequest');


// Array of valid uppercase ENUMs from your Shipment model
const VALID_SHIPMENT_STATUSES = [
    'PENDING', 
    'IN_TRANSIT', 
    'OUT_FOR_DELIVERY', 
    'DELIVERED', 
    'EXCEPTION', 
    'CANCELLED'
];



// @desc    Get all users (for Admin lists/dropdowns)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        // Fetch all users, but only select the necessary fields for listing (e.g., ID, name, email)
        const users = await User.find({})
            .select('_id name email isEmployee') 
            .sort({ createdAt: -1 }); // Newest users first

        res.json(users);
    } catch (error) {
        console.error(`Error fetching user list: ${error.message}`);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
};

// @desc    Get all Services (Admin view - private)
// @route   GET /api/admin/services
// @access  Private/Admin
const getAdminServices = async (req, res) => { // Renamed for clarity
    try {
        // Fetch all services, regardless of publication status
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching services', error: error.message });
    }
};

// @desc    Create a new Service (Logic already partially created)
// @route   POST /api/admin/services
// @access  Private/Admin
const createService = async (req, res) => {
    const { title, subtitle, details, isPublished } = req.body;
    
    // Check if image was uploaded by Multer
    const imageUrl = req.file ? `/uploads/services/${req.file.filename}` : undefined;
    
    // Server-side validation
    if (!title || !subtitle || !details) {
        return res.status(400).json({ message: 'Title, subtitle, and details are required.' });
    }
    
    try {
        const service = new Service({
            title,
            subtitle,
            details,
            isPublished: isPublished || true,
            image: imageUrl, 
            // Note: If you want to associate the service with the admin user: user: req.user._id,
        });

        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        res.status(400).json({ message: 'Error creating service. Title may already exist.', error: error.message });
    }
};

// @desc    Update a Service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
    const { title, subtitle, details, isPublished } = req.body;
    const imageUrl = req.file ? `/uploads/services/${req.file.filename}` : undefined;
    
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            service.title = title || service.title;
            service.subtitle = subtitle || service.subtitle;
            service.details = details || service.details;
            service.isPublished = isPublished !== undefined ? isPublished : service.isPublished;
            // Update image path only if a new file was uploaded
            if (imageUrl) {
                service.image = imageUrl;
            }
            
            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating service', error: error.message });
    }
};

// @desc    Delete a Service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (service) {
            // OPTIONAL: Add logic here to delete the associated image file from the server filesystem
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting service', error: error.message });
    }
};

// @desc    Get all Services for Public Display (Only those marked 'isPublished: true')
// @route   GET /api/services
// @access  Public
const getPublicServices = async (req, res) => {
    try {
        // Fetch only published services for the customer-facing site
        const services = await Service.find({ isPublished: true }).select('title subtitle details image');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching public services', error: error.message });
    }
};

//=========================================================================================//

//                                 ADMIN RATES CRUD & CALCULATOR LOGIC   

//=========================================================================================//
// @desc    Get all Rate Tariffs
// @route   GET /api/admin/rates
// @access  Private/Admin
const getTariffs = async (req, res) => {
    try {
        const tariffs = await RateTariff.find({});
        res.json(tariffs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching tariffs', error: error.message });
    }
};

// @desc    Create a new Rate Tariff
// @route   POST /api/admin/rates
// @access  Private/Admin
const createTariff = async (req, res) => {
    try {
        const tariff = await RateTariff.create(req.body);
        res.status(201).json(tariff);
    } catch (error) {
        // Handle unique index error if rate overlaps another
        res.status(400).json({ message: 'Error creating tariff. Check if a rate with these zones and weight range already exists.', error: error.message });
    }
};

// ... (Add updateTariff and deleteTariff similarly to the Service CRUD)

// @desc    Calculate instant shipping rate
// @route   POST /api/rates/calculate
// @access  Public
const calculateRate = async (req, res) => {
    // 1. Get required parameters from client request
    const { origin, destination, service, weight } = req.body; 
    
    if (!origin || !destination || !service || !weight || isNaN(weight)) {
        return res.status(400).json({ message: 'Missing required parameters for rate calculation.' });
    }
    try {
        // 2. Find the matching tariff (based on active status, service, zones, and weight bracket)
        const tariff = await RateTariff.findOne({
            serviceType: service,
            originZone: origin,      // In a real system, these would be Zone IDs
            destinationZone: destination, // In a real system, these would be Zone IDs
            minWeight: { $lte: weight }, // Weight must be greater than or equal to minWeight
            maxWeight: { $gte: weight }, // Weight must be less than or equal to maxWeight
            isActive: true,
        });

        if (!tariff) {
            return res.status(404).json({ message: `No active rate found for this combination (${service}, ${origin} to ${destination}, ${weight}kg).` });
        }

        // 3. Perform the calculation (Enterprise Security Requirement: Calculations must happen on the server)
        const totalCost = tariff.baseCost + (tariff.costPerUnit * weight);
        
        // 4. Return the calculated rate
        res.json({
            serviceType: service,
            calculatedRate: totalCost.toFixed(2), // Format to 2 decimal places
            currency: 'USD', // Define currency
            details: `Base: ${tariff.baseCost.toFixed(2)}, Cost per kg: ${tariff.costPerUnit.toFixed(2)}`
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during rate calculation', error: error.message });
    }
};
//=======================================================================================//

//                                 SHIPMENT AND TRACKING

//=======================================================================================//
const generateTrackingNumber = () => {
    // Generate a unique 10-character alphanumeric ID
    return 'CLY' + Math.random().toString(36).substring(2, 11).toUpperCase(); 
};

// @desc    Create a new Shipment
// @route   POST /api/admin/shipments
// @access  Private/Admin
// server/controllers/adminController.js (Final Correction for Mongoose Validation)

const createShipment = async (req, res) => {
    // 1. Deconstruct the entire req.body to access all necessary fields
    // NOTE: The frontend passes fields nested under origin, destination, etc., 
    // but your NEW schema expects many of them flat. We must manually map them.
    const { 
        userId, calculatedRate, currentStatus,
        shipmentDetails, origin, destination 
    } = req.body;

    try {
        const trackingNumber = generateTrackingNumber();

        // 2. Explicitly map required fields to the Mongoose Schema names
        // Note the mapping of:
        // - userId (from frontend) to customer (in schema)
        // - calculatedRate is passed directly
        // - Nested fields are pulled out (e.g., origin.city -> originCity)
        const shipment = new Shipment({
            trackingNumber,
            
            // --- Required Root Fields ---
            customer: userId, // Maps frontend 'userId' to schema 'customer'
            calculatedRate: calculatedRate, // **FIX: ENSURING IT IS PRESENT**
            serviceType: shipmentDetails.serviceType, // Pulls from nested object
            weight: shipmentDetails.weight, // Pulls from nested object

            // --- Required Location Fields ---
            originCity: origin.city,
            originCountry: origin.country,
            destinationCity: destination.city,
            destinationCountry: destination.country,

            // --- Optional/Default Fields ---
            currentStatus: currentStatus || 'PENDING', // Uses schema default if missing
            dimensions: shipmentDetails.dimensions, 
            
            // NOTE: origin.address and destination.address are missing in your new schema, 
            // but the required fields are satisfied above.

        });

        const createdShipment = await shipment.save();

        // 3. Create the first tracking event
        const initialEvent = new TrackingEvent({
            shipment: createdShipment._id,
            status: 'SHIPMENT CREATED', // Use a capitalized status for consistency
            location: `${origin.city}, ${origin.country}`,
        });
        await initialEvent.save();

        res.status(201).json(createdShipment);
    } catch (error) {
        console.error('Shipment Creation Mongoose Error:', error.message); 
        
        // Return a 400 with the specific error message to the client for immediate debugging
        res.status(400).json({ 
            message: 'Error creating shipment. Check server logs for validation details.', 
            error: error.message 
        });
    }
};

// @desc    Get all shipments (for Admin list view)
// @route   GET /api/admin/shipments
// @access  Private/Admin
const getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({})
            // Crucially, populate the 'customer' field to get the name for the list view
            .populate('customer', 'name') 
            .sort({ createdAt: -1 }); // Show newest shipments first

        res.json(shipments);
    } catch (error) {
        console.error(`Error fetching shipments list: ${error.message}`);
        res.status(500).json({ message: 'Server error fetching shipments.' });
    }
};

// @desc    Get a single shipment by ID (for Admin tracking update)
// @route   GET /api/admin/shipments/:id
// @access  Private/Admin
const getShipmentById = async (req, res) => {
    try {
        const shipmentId = req.params.id;
        
        // 1. Fetch the shipment details by MongoDB ID
        const shipment = await Shipment.findById(shipmentId)
            // Populate customer and optionally the carrier/employee if that relationship exists
            .populate('customer', 'name email'); 

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // 2. Fetch all tracking events for this shipment
        const trackingHistory = await TrackingEvent.find({ shipment: shipmentId })
            .sort({ timestamp: 1 }); // Oldest first

        // Return both shipment details and history
        res.json({ shipment, trackingHistory });

    } catch (error) {
        console.error(`Error fetching shipment ${req.params.id}: ${error.message}`);
        // Often a Mongoose CastError if the ID is malformed
        res.status(404).json({ message: 'Invalid Shipment ID or Server Error' });
    }
};

// @desc    Add a new tracking event to a shipment
// @route   POST /api/admin/shipments/:id/track
// @access  Private/Admin
const addTrackingEvent = async (req, res) => {
    const { status, location, details } = req.body;
    const { shipmentId } = req.params; // Destructure and rename 'id' to 'shipmentId'

    if (!status || !location) {
        return res.status(400).json({ message: 'Status and location are required for a tracking event.' });
    }

    try {
        // 1. Find the shipment
        const shipment = await Shipment.findById(shipmentId);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found.' });
        }
        
        // --- 2. Determine and Set the High-Level Status ---
        
        // A. Normalize the detailed event status (e.g., "Picked Up" -> "PICKED_UP")
        const normalizedEventStatus = status.toUpperCase().replace(/ /g, '_');
        
        // B. Map the normalized status to a valid Shipment ENUM
        let newCurrentStatus = shipment.currentStatus; // Default to current state

        if (normalizedEventStatus.includes('DELIVERED')) {
            newCurrentStatus = 'DELIVERED';
            shipment.deliveryDate = Date.now();
        } else if (normalizedEventStatus.includes('OUT_FOR_DELIVERY')) {
            newCurrentStatus = 'OUT_FOR_DELIVERY';
        } else if (
            normalizedEventStatus.includes('TRANSIT') || 
            normalizedEventStatus.includes('DEPARTED') ||
            normalizedEventStatus.includes('PICKED_UP')
        ) {
            // Use IN_TRANSIT for any movement status, unless the shipment is already delivered/cancelled
            if (shipment.currentStatus !== 'DELIVERED' && shipment.currentStatus !== 'CANCELLED') {
                newCurrentStatus = 'IN_TRANSIT';
            }
        } else if (normalizedEventStatus.includes('CANCELLED')) {
            newCurrentStatus = 'CANCELLED';
        } else if (normalizedEventStatus.includes('EXCEPTION') || normalizedEventStatus.includes('HELD')) {
            newCurrentStatus = 'EXCEPTION';
        }

        // C. Update the shipment status only if it's a valid enum value
        if (VALID_SHIPMENT_STATUSES.includes(newCurrentStatus)) {
            shipment.currentStatus = newCurrentStatus;
            await shipment.save();
        } 
        // Note: If the status is not mapped to a high-level ENUM, the shipment's status remains unchanged.

        // --- 3. Create and save the new detailed tracking event ---
        const trackingEvent = new TrackingEvent({
            shipment: shipmentId,
            status: status, // Keep the detailed string status for the timeline display
            location,
            details,
        });

        const createdEvent = await trackingEvent.save();

        res.status(201).json({ 
            message: 'Tracking event added and shipment status updated successfully.',
            event: createdEvent
        });
        
    } catch (error) {
        // Log the detailed error to your server console for specific debugging
        console.error('SERVER ERROR IN addTrackingEvent:', error);
        
        // Return a generic error message to the client
        res.status(500).json({ 
            message: 'Server error adding tracking event. Check server logs for details.', 
            error: error.message 
        });
    }
};

//=======================================================================================//

//                                 QUOTES

//=======================================================================================//
// @desc    Admin view all quote requests
// @route   GET /api/admin/quotes
// @access  Private/Admin
const getQuoteRequests = async (req, res) => {
    try {
        // Fetch all quotes, sorted by creation date (newest first)
        // You might consider adding pagination later if the list gets huge
        const quotes = await QuoteRequest.find({})
            .sort({ createdAt: -1 }); // Sort descending by creation date

        res.json(quotes);

    } catch (error) {
        console.error('Error fetching quote list:', error);
        res.status(500).json({ message: 'Server error fetching quote requests.', error: error.message });
    }
};

// @desc    Admin view a single quote request by ID
// @route   GET /api/admin/quotes/:id
// @access  Private/Admin
const getQuoteRequestById = async (req, res) => {
    try {
        console.log(`Attempting to fetch quote ID: ${req.params.id}`);
        const quote = await QuoteRequest.findById(req.params.id);

        if (quote) {
            res.json(quote);
        } else {
            res.status(404).json({ message: 'Quote request not found' });
        }
    } catch (error) {
        console.error('Error fetching quote details:', error);
        // Handle case where ID format is invalid (e.g., not 24 characters)
        res.status(400).json({ message: 'Invalid Quote ID format' });
    }
};



// @desc    Admin update the status (isProcessed) of a quote request
// @route   PUT /api/admin/quotes/:id/process
// @access  Private/Admin
const updateQuoteStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const quote = await QuoteRequest.findById(id);

        if (quote) {
            // Toggle the status or explicitly set it to true
            quote.isProcessed = true; 
            
            const updatedQuote = await quote.save();

            res.json({ 
                message: 'Quote status updated to Processed.', 
                quote: updatedQuote 
            });
        } else {
            res.status(404).json({ message: 'Quote request not found' });
        }
    } catch (error) {
        console.error('Error updating quote status:', error);
        res.status(500).json({ message: 'Server error updating quote status.' });
    }
};

//=======================================================================================//

//                                 dashboard statistics

//=======================================================================================//

// @desc    Admin fetch dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        // --- 1. General Counts ---
        const totalShipments = await Shipment.countDocuments();
        const totalUsers = await User.countDocuments({ isAdmin: false }); // Count only regular users

        // --- 2. Quote Request Counts ---
        const totalQuotes = await QuoteRequest.countDocuments();
        const pendingQuotes = await QuoteRequest.countDocuments({ isProcessed: false });

        // --- 3. Shipment Status Counts (Example) ---
        const shipmentsAwaitingPickup = await Shipment.countDocuments({ status: 'Awaiting Pickup' });

        // --- 4. User Stats (e.g., New Users in the last 7 days) ---
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, isAdmin: false });

         // --- 5. Service Count (Only the published services) ---
        const publishedServices = await Service.countDocuments({ isPublished: true });

        res.json({
            shipmentStats: {
                total: totalShipments,
                awaitingPickup: shipmentsAwaitingPickup,
            },
            quoteStats: {
                total: totalQuotes,
                pending: pendingQuotes,
            },
            userStats: {
                total: totalUsers,
                newThisWeek: newUsers,
            },
            servicesAvailable: publishedServices, 
        });

    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats.' });
    }
};




module.exports = { 
    getUsers,
    getAdminServices, 
    createService, 
    updateService, 
    deleteService,
    getPublicServices,
    getTariffs,
    createTariff,
    calculateRate,
    createShipment,
    getShipments,
    getShipmentById,
    addTrackingEvent,
    getQuoteRequests,
    getQuoteRequestById,
    updateQuoteStatus,
    getDashboardStats,
};
