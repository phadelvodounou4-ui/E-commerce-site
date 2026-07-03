const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'marche_direct_secret_key_2026';

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

const authMiddleware = function(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'fail', message: 'Non autorisé' });
  try {
    var decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'Token invalide' });
  }
};

async function initDB() {
  await pool.query('DROP TABLE IF EXISTS cart_items');
  await pool.query('DROP TABLE IF EXISTS products');
  await pool.query('DROP TABLE IF EXISTS users');
  await pool.query('CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, description TEXT, image TEXT, stock INTEGER DEFAULT 1, category VARCHAR(100), location VARCHAR(255), seller_id INTEGER, seller_name VARCHAR(255), created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), phone VARCHAR(50), city VARCHAR(255), avatar TEXT, role VARCHAR(20) DEFAULT \'customer\')');
  await pool.query('CREATE TABLE cart_items (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), quantity INTEGER DEFAULT 1)');
  var hash = await bcrypt.hash('123456', 10);
  await pool.query('INSERT INTO users (email, password, first_name, role) VALUES ($1,$2,$3,$4)', ['admin@shop.com', hash, 'Admin', 'admin']);
  console.log('Base de données initialisée');
}
initDB().catch(console.error);

app.get('/', function(req, res) { res.json({ status: 'success' }); });

app.get('/api/v1/products', async function(req, res) {
  var result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json({ status: 'success', data: { products: result.rows } });
});

app.get('/api/v1/products/:id', async function(req, res) {
  var result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ status: 'fail' });
  res.json({ status: 'success', data: { product: result.rows[0] } });
});

app.post('/api/v1/auth/register', async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var phone = req.body.phone;
  var city = req.body.city;
  try {
    var hash = await bcrypt.hash(password, 10);
    var result = await pool.query('INSERT INTO users (email, password, first_name, last_name, phone, city) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, email, first_name, last_name, role', [email, hash, firstName, lastName, phone, city]);
    var user = result.rows[0];
    var token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ status: 'success', data: { user: user, token: token } });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ status: 'fail', message: 'Email déjà utilisé' });
    res.status(500).json({ status: 'error' });
  }
});

app.post('/api/v1/auth/login', async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) return res.status(401).json({ status: 'fail', message: 'Identifiants incorrects' });
  var user = result.rows[0];
  var valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ status: 'fail', message: 'Identifiants incorrects' });
  var token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ status: 'success', data: { user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role, phone: user.phone, city: user.city }, token: token } });
});

app.get('/api/v1/auth/me', authMiddleware, async function(req, res) {
  var result = await pool.query('SELECT id, email, first_name, last_name, phone, city, avatar, role FROM users WHERE id = $1', [req.user.id]);
  res.json({ status: 'success', data: { user: result.rows[0] } });
});

app.post('/api/v1/products', authMiddleware, upload.single('image'), async function(req, res) {
  try {
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var category = req.body.category;
    var location = req.body.location;
    var sellerName = req.user.email;
    var imageUrl = req.file ? req.file.path : null;
    var result = await pool.query('INSERT INTO products (name, price, description, image, category, location, seller_id, seller_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [name, price, description, imageUrl, category, location, req.user.id, sellerName]);
    res.status(201).json({ status: 'success', data: { product: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/v1/users/:id/products', async function(req, res) {
  var result = await pool.query('SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC', [req.params.id]);
  res.json({ status: 'success', data: { products: result.rows } });
});

app.get('/api/v1/cart', async function(req, res) {
  var result = await pool.query('SELECT c.*, p.name, p.price, p.image FROM cart_items c JOIN products p ON c.product_id = p.id');
  var total = result.rows.reduce(function(s, i) { return s + parseFloat(i.price) * i.quantity; }, 0);
  res.json({ status: 'success', data: { items: result.rows, total: total.toFixed(2) } });
});

app.post('/api/v1/cart', async function(req, res) {
  var productId = req.body.productId;
  var e = await pool.query('SELECT * FROM cart_items WHERE product_id = $1', [productId]);
  if (e.rows.length > 0) await pool.query('UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = $1', [productId]);
  else await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (1, $1, 1)', [productId]);
  res.json({ status: 'success' });
});

app.delete('/api/v1/cart/:id', async function(req, res) {
  await pool.query('DELETE FROM cart_items WHERE id = $1', [req.params.id]);
  res.json({ status: 'success' });
});

app.get('/api/v1/admin/products', authMiddleware, async function(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ status: 'fail' });
  var result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json({ status: 'success', data: { products: result.rows } });
});

app.delete('/api/v1/admin/products/:id', authMiddleware, async function(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ status: 'fail' });
  await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  res.json({ status: 'success' });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() { console.log('Server running on port ' + PORT); });
