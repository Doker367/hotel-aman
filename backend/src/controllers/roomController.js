/* ============================================================
   Rooms Controller
   ============================================================ */

const Room = require('../models/Room');

exports.getAllRooms = async (req, res, next) => {
  try {
    const { category, featured, available } = req.query;
    const rooms = await Room.findAll({
      category,
      featured: featured === 'true' ? true : undefined,
      available: available === 'false' ? false : true
    });

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Support both UUID and slug lookup
    const room = id.includes('-') && id.length > 30
      ? await Room.findById(id)
      : await Room.findBySlug(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    res.json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

exports.checkAvailability = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: 'roomId, checkIn, and checkOut are required'
      });
    }

    const available = await Room.checkAvailability(roomId, checkIn, checkOut);

    res.json({
      success: true,
      data: { available, roomId, checkIn, checkOut }
    });
  } catch (err) {
    next(err);
  }
};
