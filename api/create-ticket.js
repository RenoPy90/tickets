const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, subject, description, priority, assigned_to } = req.body;

  if (!email || !subject || !description || !priority || !assigned_to) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    await pool.query(
      `INSERT INTO tickets (email, subject, description, priority, assigned_to)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, subject, description, priority, assigned_to]
    );

    res.status(201).json({ message: 'Ticket creado correctamente' });
  } catch (err) {
    console.error('Error al guardar ticket:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
