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

cloudinary.config({ cloud_name: 'j0ht6l3u', api_key: '936581417235569', api_secret: 'IpkzG--BUS_iJ1_h_5d_QG2C0Wg' });
const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'marketplace', allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] } });
const upload = multer({ storage });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://ecommerce_db_awz7_user:s5DHzhPcNlVHgytqdTUoewmOpffPyCEe@dpg-d939816h2hms738cejsg-a/ecommerce_db_awz7',
  ssl: { rejectUnauthorized: false }
});

const authMiddleware = function(req, res, next) {
  var token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'fail', message: 'Non autorisé' });
  try { var decoded = jwt.verify(token, JWT_SECRET); req.user = decoded; next(); }
  catch (err) { return res.status(401).json({ status: 'fail', message: 'Token invalide' }); }
};

async function initDB() {
  await pool.query('DROP TABLE IF EXISTS notifications');
  await pool.query('DROP TABLE IF EXISTS ratings');
  await pool.query('DROP TABLE IF EXISTS messages');
  await pool.query('DROP TABLE IF EXISTS cart_items');
  await pool.query('DROP TABLE IF EXISTS products');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query('CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, description TEXT, image TEXT, stock INTEGER DEFAULT 1, category VARCHAR(100), location VARCHAR(255), seller_id INTEGER, seller_name VARCHAR(255), created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), phone VARCHAR(50), city VARCHAR(255), avatar TEXT, role VARCHAR(20) DEFAULT \'customer\')');
  await pool.query('CREATE TABLE cart_items (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), quantity INTEGER DEFAULT 1)');
  await pool.query('CREATE TABLE messages (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), sender_id INTEGER REFERENCES users(id), receiver_id INTEGER REFERENCES users(id), content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE ratings (id SERIAL PRIMARY KEY, seller_id INTEGER REFERENCES users(id), buyer_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), score INTEGER CHECK(score >= 1 AND score <= 5), comment TEXT, created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE notifications (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), type VARCHAR(50), title VARCHAR(255), message TEXT, is_read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW())');

  var hash = await bcrypt.hash('123456', 10);
  await pool.query('INSERT INTO users (email, password, first_name, role) VALUES ($1,$2,$3,$4)', ['admin@shop.com', hash, 'Admin', 'admin']);
  console.log('Base de données initialisée');
}
initDB().catch(console.error);

// Routes
app.get('/', function(req, res) { res.json({ status: 'success' }); });

app.get('/api/v1/products', async function(req, res) {
  var query = 'SELECT p.*, COALESCE(AVG(r.score)::numeric(2,1), 0) as rating_avg, COUNT(r.id)::integer as rating_count FROM products p LEFT JOIN ratings r ON p.seller_id = r.seller_id WHERE 1=1';
  var params = [];
  if (req.query.search) { params.push('%' + req.query.search + '%'); query += ' AND p.name ILIKE $' + params.length; }
  if (req.query.category) { params.push(req.query.category); query += ' AND p.category = $' + params.length; }
  if (req.query.location) { params.push('%' + req.query.location + '%'); query += ' AND p.location ILIKE $' + params.length; }
  query += ' GROUP BY p.id ORDER BY p.created_at DESC';
  var result = await pool.query(query, params);
  res.json({ status: 'success', data: { products: result.rows } });
});

app.get('/api/v1/products/:id', async function(req, res) {
  var result = await pool.query('SELECT p.*, COALESCE(AVG(r.score)::numeric(2,1), 0) as rating_avg, COUNT(r.id)::integer as rating_count FROM products p LEFT JOIN ratings r ON p.seller_id = r.seller_id WHERE p.id = $1 GROUP BY p.id', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ status: 'fail' });
  res.json({ status: 'success', data: { product: result.rows[0] } });
});

app.post('/api/v1/products', authMiddleware, upload.single('image'), async function(req, res) {
  try {
    var imageUrl = req.file ? req.file.path : null;
    var result = await pool.query('INSERT INTO products (name, price, description, image, category, location, seller_id, seller_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [req.body.name, req.body.price, req.body.description, imageUrl, req.body.category, req.body.location, req.user.id, req.user.email]);
    res.status(201).json({ status: 'success', data: { product: result.rows[0] } });
  } catch (err) { res.status(500).json({ status: 'error' }); }
});

app.get('/api/v1/users/:id/products', async function(req, res) {
  var result = await pool.query('SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC', [req.params.id]);
  res.json({ status: 'success', data: { products: result.rows } });
});

// Auth
app.post('/api/v1/auth/register', async function(req, res) {
  try {
    var hash = await bcrypt.hash(req.body.password, 10);
    var result = await pool.query('INSERT INTO users (email, password, first_name, last_name, phone, city) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, email, first_name, last_name, role', [req.body.email, hash, req.body.firstName, req.body.lastName, req.body.phone, req.body.city]);
    var token = jwt.sign({ id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ status: 'success', data: { user: result.rows[0], token: token } });
  } catch (err) { if (err.code === '23505') return res.status(400).json({ status: 'fail', message: 'Email déjà utilisé' }); res.status(500).json({ status: 'error' }); }
});

app.post('/api/v1/auth/login', async function(req, res) {
  var result = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
  if (result.rows.length === 0) return res.status(401).json({ status: 'fail', message: 'Identifiants incorrects' });
  if (!(await bcrypt.compare(req.body.password, result.rows[0].password))) return res.status(401).json({ status: 'fail', message: 'Identifiants incorrects' });
  var token = jwt.sign({ id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ status: 'success', data: { user: { id: result.rows[0].id, email: result.rows[0].email, first_name: result.rows[0].first_name, last_name: result.rows[0].last_name, role: result.rows[0].role, phone: result.rows[0].phone, city: result.rows[0].city }, token: token } });
});

// Messages
app.get('/api/v1/messages/:productId', authMiddleware, async function(req, res) {
  var result = await pool.query('SELECT m.*, u.first_name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.product_id = $1 AND (m.sender_id = $2 OR m.receiver_id = $2) ORDER BY m.created_at ASC', [req.params.productId, req.user.id]);
  res.json({ status: 'success', data: { messages: result.rows } });
});

app.post('/api/v1/messages', authMiddleware, async function(req, res) {
  var result = await pool.query('INSERT INTO messages (product_id, sender_id, receiver_id, content) VALUES ($1,$2,$3,$4) RETURNING *', [req.body.product_id, req.user.id, req.body.receiver_id, req.body.content]);
  await pool.query('INSERT INTO notifications (user_id, type, title, message) VALUES ($1,$2,$3,$4)', [req.body.receiver_id, 'message', 'Nouveau message', 'Vous avez reçu un message concernant votre annonce']);
  res.status(201).json({ status: 'success', data: { message: result.rows[0] } });
});

// Notations
app.post('/api/v1/ratings', authMiddleware, async function(req, res) {
  try {
    var result = await pool.query('INSERT INTO ratings (seller_id, buyer_id, product_id, score, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *', [req.body.seller_id, req.user.id, req.body.product_id, req.body.score, req.body.comment]);
    await pool.query('INSERT INTO notifications (user_id, type, title, message) VALUES ($1,$2,$3,$4)', [req.body.seller_id, 'rating', 'Nouvelle note', 'Vous avez reçu une note de ' + req.body.score + ' étoiles !']);
    res.status(201).json({ status: 'success', data: { rating: result.rows[0] } });
  } catch (err) { res.status(500).json({ status: 'error' }); }
});

app.get('/api/v1/ratings/:sellerId', async function(req, res) {
  var result = await pool.query('SELECT r.*, u.first_name as buyer_name FROM ratings r JOIN users u ON r.buyer_id = u.id WHERE r.seller_id = $1 ORDER BY r.created_at DESC', [req.params.sellerId]);
  var avg = await pool.query('SELECT COALESCE(AVG(score)::numeric(2,1), 0) as avg FROM ratings WHERE seller_id = $1', [req.params.sellerId]);
  res.json({ status: 'success', data: { ratings: result.rows, average: avg.rows[0].avg } });
});

// Notifications
app.get('/api/v1/notifications', authMiddleware, async function(req, res) {
  var result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [req.user.id]);
  var unread = await pool.query('SELECT COUNT(*)::integer as count FROM notifications WHERE user_id = $1 AND is_read = false', [req.user.id]);
  res.json({ status: 'success', data: { notifications: result.rows, unreadCount: unread.rows[0].count } });
});

app.patch('/api/v1/notifications/read-all', authMiddleware, async function(req, res) {
  await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id]);
  res.json({ status: 'success' });
});

// Panier
app.get('/api/v1/cart', async function(req, res) {
  var result = await pool.query('SELECT c.*, p.name, p.price, p.image FROM cart_items c JOIN products p ON c.product_id = p.id');
  var total = result.rows.reduce(function(s, i) { return s + parseFloat(i.price) * i.quantity; }, 0);
  res.json({ status: 'success', data: { items: result.rows, total: total.toFixed(2) } });
});

app.post('/api/v1/cart', async function(req, res) {
  var e = await pool.query('SELECT * FROM cart_items WHERE product_id = $1', [req.body.productId]);
  if (e.rows.length > 0) await pool.query('UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = $1', [req.body.productId]);
  else await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (1, $1, 1)', [req.body.productId]);
  res.json({ status: 'success' });
});

app.delete('/api/v1/cart/:id', async function(req, res) {
  await pool.query('DELETE FROM cart_items WHERE id = $1', [req.params.id]);
  res.json({ status: 'success' });
});

// Admin
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
