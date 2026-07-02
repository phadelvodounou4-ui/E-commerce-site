const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://ecommerce_db_awz7_user:s5DHzhPcNlVHgytqdTUoewmOpffPyCEe@dpg-d939816h2hms738cejsg-a/ecommerce_db_awz7',
  ssl: { rejectUnauthorized: false }
});

// Créer les tables si elles n'existent pas
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT,
      image TEXT,
      stock INTEGER DEFAULT 0
    )
  `);
  
  // Ajouter des produits si la table est vide
  const count = await pool.query('SELECT COUNT(*) FROM products');
  if (parseInt(count.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO products (name, price, description, image, stock) VALUES
      ('Écouteurs Bluetooth', 29.99, 'Sans fil, autonomie 20h', 'https://picsum.photos/200', 50),
      ('Montre connectée', 59.99, 'Cardio, GPS, étanche', 'https://picsum.photos/201', 30),
      ('Chargeur USB-C', 19.99, 'Compatible tous appareils', 'https://picsum.photos/202', 100)
    `);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      role VARCHAR(20) DEFAULT 'customer'
    )
  `);
  
  // Ajouter un admin si la table est vide
  const userCount = await pool.query('SELECT COUNT(*) FROM users');
  if (parseInt(userCount.rows[0].count) === 0) {
    await pool.query(
      "INSERT INTO users (email, password, first_name, role) VALUES ($1, $2, $3, $4)",
      ['admin@shop.com', '123456', 'Admin', 'admin']
    );
  }
  
  console.log('Base de données initialisée');
}

initDB().catch(console.error);

// Routes
app.get('/', (req, res) => res.json({ status: 'success', message: 'API is running' }));

app.get('/api/v1/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json({ status: 'success', data: { products: result.rows, pagination: { page: 1, limit: 20, total: result.rows.length, pages: 1 } } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ status: 'success', data: { user: { id: user.id, email: user.email, firstName: user.first_name, role: user.role }, token: 'fake-token-123' } });
    } else {
      res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, password, firstName, lastName]
    );
    const user = result.rows[0];
    res.status(201).json({ status: 'success', message: 'Account created', data: { user: { id: user.id, email: user.email, firstName: user.first_name }, token: 'fake-token-456' } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Email already exists' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
