const router = require('express').Router();
const { login, getProfile } = require('../controllers/authController');
const { validateLogin } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);

module.exports = router;
