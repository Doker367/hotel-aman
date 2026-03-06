/* ============================================================
   Service Model
   ============================================================ */

const { pool } = require('../config/database');

class Service {
  static async findAll({ category, featured } = {}) {
    let query = 'SELECT * FROM services WHERE is_active = true';
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

    query += ' ORDER BY sort_order ASC';
    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async findBySlug(slug) {
    const { rows } = await pool.query(
      'SELECT * FROM services WHERE slug = $1 AND is_active = true', [slug]
    );
    return rows[0] || null;
  }
}

module.exports = Service;
