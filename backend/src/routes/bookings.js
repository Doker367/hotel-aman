const router = require('express').Router();
const { createBooking, getBookingById, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', validateBooking, createBooking);
router.get('/:id', getBookingById);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllBookings);
router.patch('/:id/status', authenticate, requireAdmin, updateBookingStatus);

module.exports = router;
