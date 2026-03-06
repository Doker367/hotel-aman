/* ============================================================
   Bookings Controller
   ============================================================ */

const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = async (req, res, next) => {
  try {
    const { room_id, guest_name, guest_email, guest_phone, 
            check_in, check_out, guests_count, special_requests } = req.body;

    // Validate room exists
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    // Check availability
    const available = await Room.checkAvailability(room_id, check_in, check_out);
    if (!available) {
      return res.status(409).json({
        success: false,
        error: 'Room is not available for the selected dates'
      });
    }

    // Calculate total price
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (nights < 1) {
      return res.status(400).json({
        success: false,
        error: 'Check-out must be after check-in'
      });
    }

    const total_price = (parseFloat(room.price_per_night) * nights).toFixed(2);

    const booking = await Booking.create({
      room_id, guest_name, guest_email, guest_phone,
      check_in, check_out, guests_count: guests_count || 1,
      special_requests, total_price, status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: {
        ...booking,
        room_name: room.name,
        nights,
        price_per_night: room.price_per_night
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, limit, offset } = req.query;
    const bookings = await Booking.findAll({
      status,
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0
    });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await Booking.updateStatus(req.params.id, status);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};
