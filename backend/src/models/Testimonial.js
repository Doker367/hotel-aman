/* ============================================================
   Testimonial Model
   ============================================================ */

const { pool } = require('../config/database');

class Testimonial {
  static async findAll({ featured } = {}) {
    let query = 'SELECT * FROM testimonials WHERE is_active = true';
    const params = [];

    if (featured !== undefined) {
      query += ' AND is_featured = $1';
      params.push(featured);
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    return rows;
  }
}

module.exports = Testimonial;
