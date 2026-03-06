const router = require('express').Router();
const { getAllRooms, getRoomById, checkAvailability } = require('../controllers/roomController');

router.get('/', getAllRooms);
router.get('/availability', checkAvailability);
router.get('/:id', getRoomById);

module.exports = router;
