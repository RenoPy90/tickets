const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener tickets:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
