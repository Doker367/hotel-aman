const router = require('express').Router();
const { getAllServices, getServiceBySlug } = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);

module.exports = router;
