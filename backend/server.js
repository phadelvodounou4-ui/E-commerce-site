const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: 'j0ht6l3u',
  api_key: '936581417235569',
  api_secret: 'IpkzG--BUS_iJ1_h_5d_QG2C0Wg'
});

const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'marketplace', allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] } });
const upload = multer({ storage });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://ecommerce_db_awz7_user:s5DHzhPcNlVHgytqdTUoewmOpffPyCEe@dpg-d939816h2hms738cejsg-a/ecommerce_db_awz7',
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  await pool.query('DROP TABLE IF EXISTS cart_items');
  await pool.query('DROP TABLE IF EXISTS products');
  await pool.query('DROP TABLE IF EXISTS users');
  await pool.query(`CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, description TEXT, image TEXT, stock INTEGER DEFAULT 1, category VARCHAR(100), location VARCHAR(255), seller_id INTEGER, seller_name VARCHAR(255), created_at TIMESTAMP DEFAULT NOW())`);
  await pool.query(`CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), phone VARCHAR(50), city VARCHAR(255), avatar TEXT, role VARCHAR(20) DEFAULT 'customer')`);
  await pool.query(`CREATE TABLE cart_items (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), quantity INTEGER DEFAULT 1)`);
  await pool.query("INSERT INTO users (email, password, first_name, role) VALUES ('admin@shop.com', '123456', 'Admin', 'admin')");
  console.log('Base de données initialisée');
}
initDB().catch(console.error);

app.get('/', (req, res) => res.json({ status: 'success' }));
app.get('/api/v1/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json({ status: 'success', data: { products: result.rows } });
});
app.get('/api/v1/products/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ status: 'fail' });
  res.json({ status: 'success', data: { product: result.rows[0] } });
});
app.post('/api/v1/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, location, seller_name } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const result = await pool.query('INSERT INTO products (name, price, description, image, category, location, seller_name) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [name, price, description, imageUrl, category, location, seller_name || 'Anonyme']);
    res.status(201).json({ status: 'success', data: { product: result.rows[0] } });
  } catch (err) { res.status(500).json({ status: 'error', message: err.message }); }
});
app.post('/api/v1/auth/register', async (req, res) => {
  const { email, password, firstName, lastName, phone, city } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (email, password, first_name, last_name, phone, city) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [email, password, firstName, lastName, phone, city]);
    res.status(201).json({ status: 'success', data: { user: result.rows[0], token: 'token-' + result.rows[0].id } });
  } catch (err) { res.status(400).json({ status: 'fail', message: 'Email déjà utilisé' }); }
});
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
  if (result.rows.length === 0) return res.status(401).json({ status: 'fail' });
  res.json({ status: 'success', data: { user: result.rows[0], token: 'token-' + result.rows[0].id } });
});
app.get('/api/v1/cart', async (req, res) => {
  const result = await pool.query('SELECT c.*, p.name, p.price, p.image FROM cart_items c JOIN products p ON c.product_id = p.id');
  const total = result.rows.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
  res.json({ status: 'success', data: { items: result.rows, total: total.toFixed(2) } });
});
app.post('/api/v1/cart', async (req, res) => {
  const { productId } = req.body;
  const e = await pool.query('SELECT * FROM cart_items WHERE product_id = $1', [productId]);
  if (e.rows.length > 0) { await pool.query('UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = $1', [productId]); }
  else { await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (1, $1, 1)', [productId]); }
  res.json({ status: 'success' });
});
app.delete('/api/v1/cart/:id', async (req, res) => {
  await pool.query('DELETE FROM cart_items WHERE id = $1', [req.params.id]);
  res.json({ status: 'success' });
});
app.get('/api/v1/admin/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json({ status: 'success', data: { products: result.rows } });
});
app.delete('/api/v1/admin/products/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  res.json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
