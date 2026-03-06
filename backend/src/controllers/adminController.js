/* ============================================================
   Admin Controller - Dashboard Stats
   ============================================================ */

const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Contact = require('../models/Contact');
const { pool } = require('../config/database');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const bookingStats = await Booking.getStats();
    
    const roomsResult = await pool.query('SELECT COUNT(*) as total FROM rooms');
    const messagesResult = await pool.query(
      'SELECT COUNT(*) FILTER (WHERE is_read = false) as unread, COUNT(*) as total FROM contact_messages'
    );

    res.json({
      success: true,
      data: {
        bookings: bookingStats,
        rooms: { total: parseInt(roomsResult.rows[0].total, 10) },
        messages: {
          total: parseInt(messagesResult.rows[0].total, 10),
          unread: parseInt(messagesResult.rows[0].unread, 10)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecentBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({ limit: 10 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};
