const router = require('express').Router();
const { getAllImages } = require('../controllers/galleryController');

router.get('/', getAllImages);

module.exports = router;
