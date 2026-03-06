/* ============================================================
   Booking Model
   ============================================================ */

const { pool } = require('../config/database');

class Booking {
  static async findAll({ status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT b.*, r.name as room_name, r.thumbnail as room_thumbnail, r.category as room_category
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE 1=1`;
    const params = [];
    let idx = 1;

    if (status) {
      query += ` AND b.status = $${idx++}`;
      params.push(status);
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT b.*, r.name as room_name, r.thumbnail as room_thumbnail, 
       r.price_per_night, r.category as room_category
       FROM bookings b JOIN rooms r ON b.room_id = r.id
       WHERE b.id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  static async create(data) {
    const { rows } = await pool.query(
      `INSERT INTO bookings (room_id, guest_name, guest_email, guest_phone, 
       check_in, check_out, guests_count, special_requests, total_price, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [data.room_id, data.guest_name, data.guest_email, data.guest_phone,
       data.check_in, data.check_out, data.guests_count, data.special_requests,
       data.total_price, data.status || 'pending']
    );
    return rows[0];
  }

  static async updateStatus(id, status) {
    const { rows } = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return rows[0];
  }

  static async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async getStats() {
    const { rows } = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COUNT(*) as total,
        COALESCE(SUM(total_price) FILTER (WHERE status != 'cancelled'), 0) as total_revenue
      FROM bookings
    `);
    return rows[0];
  }
}

module.exports = Booking;
