const router = require('express').Router();
const { getDashboardStats, getRecentBookings } = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/bookings/recent', getRecentBookings);

module.exports = router;
