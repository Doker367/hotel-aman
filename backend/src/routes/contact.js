const router = require('express').Router();
const { submitMessage, getAllMessages, markAsRead } = require('../controllers/contactController');
const { validateContact } = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', validateContact, submitMessage);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllMessages);
router.patch('/:id/read', authenticate, requireAdmin, markAsRead);

module.exports = router;
