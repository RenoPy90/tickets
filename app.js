require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

// DB Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Crear ticket
app.post('/api/create-ticket', async (req, res) => {
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
});

// Obtener tickets
app.get('/api/get-tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener tickets:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
