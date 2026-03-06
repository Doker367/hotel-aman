/* ============================================================
   Gallery Model
   ============================================================ */

const { pool } = require('../config/database');

class Gallery {
  static async findAll({ category, active = true } = {}) {
    let query = 'SELECT * FROM gallery WHERE 1=1';
    const params = [];
    let idx = 1;

    if (active !== undefined) {
      query += ` AND is_active = $${idx++}`;
      params.push(active);
    }
    if (category) {
      query += ` AND category = $${idx++}`;
      params.push(category);
    }

    query += ' ORDER BY sort_order ASC';
    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async getCategories() {
    const { rows } = await pool.query(
      'SELECT DISTINCT category FROM gallery WHERE is_active = true ORDER BY category'
    );
    return rows.map(r => r.category);
  }
}

module.exports = Gallery;
