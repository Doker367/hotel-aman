const router = require('express').Router();
const { getAllTestimonials } = require('../controllers/testimonialController');

router.get('/', getAllTestimonials);

module.exports = router;
