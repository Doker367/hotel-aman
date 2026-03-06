/* ============================================================
   Contact Model
   ============================================================ */

const { pool } = require('../config/database');

class Contact {
  static async create(data) {
    const { rows } = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.name, data.email, data.phone, data.subject, data.message]
    );
    return rows[0];
  }

  static async findAll({ unread } = {}) {
    let query = 'SELECT * FROM contact_messages';
    const params = [];

    if (unread) {
      query += ' WHERE is_read = false';
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async markAsRead(id) {
    const { rows } = await pool.query(
      'UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
}

module.exports = Contact;
