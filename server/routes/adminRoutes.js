const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/multerConfig');
const { 
    getUsers,
    getAdminServices, 
    createService, 
    updateService, 
    deleteService,
    getTariffs, 
    createTariff,
    createShipment,
    getShipments,
    getShipmentById,
    addTrackingEvent,
    getQuoteRequests,
    getQuoteRequestById,
    updateQuoteStatus,
    getDashboardStats,
    
} = require('../controllers/adminController');


// User Management Routes
// @route   GET /api/admin/users
// @access  Private/Admin
router.route('/users').get(protect, admin, getUsers);

// Service Management (GET all, POST new) + (PUT update, DELETE delete)
router.route('/services').get(protect, admin, getAdminServices).post(protect, admin, upload.single('image'), createService);
router.route('/services/:id').put(protect, admin, upload.single('image'), updateService).delete(protect, admin, deleteService);
router.route('/shipments').get(protect, admin, getShipments).post(protect, admin, createShipment);
router.route('/shipments/:id').get(protect, admin, getShipmentById);
router.route('/shipments/:shipmentId/track').post(protect, admin, addTrackingEvent);

router.route('/rates').get(protect, admin, getTariffs).post(protect, admin, createTariff);  // Rate Tariff Management (All protected by Admin)

router.route('/quotes').get(protect, admin, getQuoteRequests);
router.route('/quotes/:id').get(protect, admin, getQuoteRequestById);
router.route('/quotes/:id/process').put(protect, admin, updateQuoteStatus);     // updating the quote status

router.route('/stats').get(protect, admin, getDashboardStats);                  // fetching Dashboard Stats

    


// router.route('/rates/:id').put(protect, admin, updateTariff).delete(protect, admin, deleteTariff);    




module.exports = router;
