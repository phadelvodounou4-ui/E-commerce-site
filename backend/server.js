const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://ecommerce_db_awz7_user:s5DHzhPcNlVHgytqdTUoewmOpffPyCEe@dpg-d939816h2hms738cejsg-a/ecommerce_db_awz7',
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  await pool.query('DROP TABLE IF EXISTS cart_items');
  await pool.query('DROP TABLE IF EXISTS products');
  await pool.query('DROP TABLE IF EXISTS users');
  
  await pool.query(`CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, description TEXT, image TEXT, stock INTEGER DEFAULT 0)`);
  await pool.query(`CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), role VARCHAR(20) DEFAULT 'customer')`);
  await pool.query(`CREATE TABLE cart_items (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), quantity INTEGER DEFAULT 1)`);

  await pool.query(`INSERT INTO products (name, price, description, image, stock) VALUES ('Écouteurs Bluetooth', 29.99, 'Sans fil, autonomie 20h', '🎧', 50), ('Montre Connectée', 59.99, 'Cardio, GPS, étanche', '⌚', 30), ('Chargeur USB-C', 19.99, 'Compatible tous appareils', '🔌', 100)`);
  await pool.query("INSERT INTO users (email, password, first_name, role) VALUES ('admin@shop.com', '123456', 'Admin', 'admin')");
  console.log('Base de données initialisée');
}
initDB().catch(console.error);

// Routes
app.get('/', (req, res) => res.json({ status: 'success', message: 'API running' }));

// Produits
app.get('/api/v1/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY id');
  res.json({ status: 'success', data: { products: result.rows, pagination: { page: 1, limit: 20, total: result.rows.length, pages: 1 } } });
});

app.get('/api/v1/products/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ status: 'fail', message: 'Not found' });
  res.json({ status: 'success', data: { product: result.rows[0] } });
});

// Auth
app.post('/api/v1/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (email, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id, email, first_name, role', [email, password, firstName, lastName]);
    res.status(201).json({ status: 'success', data: { user: result.rows[0], token: 'token-' + result.rows[0].id } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Email déjà utilisé' });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
  if (result.rows.length === 0) return res.status(401).json({ status: 'fail', message: 'Identifiants incorrects' });
  res.json({ status: 'success', data: { user: result.rows[0], token: 'token-' + result.rows[0].id } });
});

// Panier
app.get('/api/v1/cart', async (req, res) => {
  const userId = req.headers['user-id'] || '1';
  const result = await pool.query('SELECT c.*, p.name, p.price, p.image FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1', [userId]);
  const total = result.rows.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  res.json({ status: 'success', data: { items: result.rows, total: total.toFixed(2) } });
});

app.post('/api/v1/cart', async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.headers['user-id'] || '1';
  const existing = await pool.query('SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
  if (existing.rows.length > 0) {
    await pool.query('UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2', [quantity || 1, existing.rows[0].id]);
  } else {
    await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1,$2,$3)', [userId, productId, quantity || 1]);
  }
  res.json({ status: 'success', message: 'Ajouté au panier' });
});

app.delete('/api/v1/cart/:id', async (req, res) => {
  await pool.query('DELETE FROM cart_items WHERE id = $1', [req.params.id]);
  res.json({ status: 'success', message: 'Supprimé' });
});

// Admin
app.get('/api/v1/admin/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY id');
  res.json({ status: 'success', data: { products: result.rows } });
});

app.post('/api/v1/admin/products', async (req, res) => {
  const { name, price, description, stock } = req.body;
  const result = await pool.query('INSERT INTO products (name, price, description, stock) VALUES ($1,$2,$3,$4) RETURNING *', [name, price, description, stock || 0]);
  res.status(201).json({ status: 'success', data: { product: result.rows[0] } });
});

app.put('/api/v1/admin/products/:id', async (req, res) => {
  const { name, price, description, stock } = req.body;
  await pool.query('UPDATE products SET name=$1, price=$2, description=$3, stock=$4 WHERE id=$5', [name, price, description, stock, req.params.id]);
  res.json({ status: 'success', message: 'Produit mis à jour' });
});

app.delete('/api/v1/admin/products/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  res.json({ status: 'success', message: 'Produit supprimé' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
