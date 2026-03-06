/* ============================================================
   Validation Middleware
   ============================================================ */

const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

const validateBooking = [
  body('room_id').isUUID().withMessage('Valid room ID is required'),
  body('guest_name').trim().isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
  body('guest_email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('guest_phone').optional().trim().isLength({ max: 50 }),
  body('check_in').isISO8601().withMessage('Valid check-in date is required'),
  body('check_out').isISO8601().withMessage('Valid check-out date is required'),
  body('guests_count').optional().isInt({ min: 1, max: 10 }).withMessage('Guests must be between 1 and 10'),
  body('special_requests').optional().trim().isLength({ max: 2000 }),
  handleValidation
];

const validateContact = [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().isLength({ max: 50 }),
  body('subject').optional().trim().isLength({ max: 300 }),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
  handleValidation
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

module.exports = { validateBooking, validateContact, validateLogin };
