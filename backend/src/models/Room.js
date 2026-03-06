/* ============================================================
   Room Model
   ============================================================ */

const { pool } = require('../config/database');

class Room {
  static async findAll({ category, featured, available } = {}) {
    let query = 'SELECT * FROM rooms WHERE 1=1';
    const params = [];
    let idx = 1;

    if (category) {
      query += ` AND category = $${idx++}`;
      params.push(category);
    }
    if (featured !== undefined) {
      query += ` AND is_featured = $${idx++}`;
      params.push(featured);
    }
    if (available !== undefined) {
      query += ` AND is_available = $${idx++}`;
      params.push(available);
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';
    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async findBySlug(slug) {
    const { rows } = await pool.query('SELECT * FROM rooms WHERE slug = $1', [slug]);
    return rows[0] || null;
  }

  static async create(data) {
    const { rows } = await pool.query(
      `INSERT INTO rooms (name, slug, category, description, short_desc, price_per_night, 
       max_guests, size_sqm, bed_type, view_type, rating, amenities, images, thumbnail, 
       is_available, is_featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
      [data.name, data.slug, data.category, data.description, data.short_desc,
       data.price_per_night, data.max_guests, data.size_sqm, data.bed_type,
       data.view_type, data.rating, data.amenities, data.images, data.thumbnail,
       data.is_available, data.is_featured, data.sort_order]
    );
    return rows[0];
  }

  static async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    
    const { rows } = await pool.query(
      `UPDATE rooms SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    return rows[0];
  }

  static async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async checkAvailability(roomId, checkIn, checkOut) {
    const { rows } = await pool.query(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE room_id = $1 AND status != 'cancelled'
       AND (check_in < $3 AND check_out > $2)`,
      [roomId, checkIn, checkOut]
    );
    return parseInt(rows[0].count, 10) === 0;
  }
}

module.exports = Room;
