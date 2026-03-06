/* ============================================================
   User Model
   ============================================================ */

const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true', [email]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1', [id]
    );
    return rows[0] || null;
  }

  static async verifyPassword(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }
}

module.exports = User;
