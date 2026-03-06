/* ============================================================
   Database Configuration - PostgreSQL Connection Pool
   ============================================================ */

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'aman_resorts',
  user: process.env.DB_USER || 'aman_admin',
  password: process.env.DB_PASSWORD || 'AmanSecure2024!',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

const testConnection = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW() AS current_time');
    console.log('[DB] Connected to PostgreSQL at', result.rows[0].current_time);
  } finally {
    client.release();
  }
};

module.exports = { pool, testConnection };
