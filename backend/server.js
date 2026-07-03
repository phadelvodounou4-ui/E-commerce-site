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

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

function computeMarketplaceRank(product, userContext) {
  var score = 0;
  var distance = userContext.lat && userContext.lon && product.lat && product.lon ? haversineDistance(userContext.lat, userContext.lon, product.lat, product.lon) : 999;
  if (distance < 1) score += 40; else if (distance < 5) score += 35; else if (distance < 10) score += 30; else if (distance < 25) score += 25; else if (distance < 50) score += 18; else if (distance < 100) score += 10; else if (distance < 200) score += 5; else score += 1;

  if (userContext.search && product.name) {
    var searchLower = userContext.search.toLowerCase();
    var productText = (product.name + ' ' + (product.description || '')).toLowerCase();
    if (productText.indexOf(searchLower) !== -1) score += 25; else score += 10;
  } else score += 12;

  var rating = parseFloat(product.seller_rating_avg) || 0;
  var ratingCount = parseInt(product.seller_rating_count) || 0;
  if (ratingCount >= 10) score += rating * 2; else if (ratingCount >= 5) score += rating * 1.5; else score += 2.5;
  score += (parseFloat(product.seller_response_rate) || 0.5) * 5;

  var views = parseInt(product.view_count) || 0;
  if (views > 100) score += 4; else if (views > 50) score += 3; else if (views > 10) score += 2; else score += 1;

  var hoursOld = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60);
  if (hoursOld < 1) score += 10; else if (hoursOld < 6) score += 9; else if (hoursOld < 24) score += 7; else if (hoursOld < 72) score += 5; else if (hoursOld < 168) score += 3; else score += 1;

  if (product.image) score += 3;
  return { final_score: Math.round(score), distance_km: distance < 999 ? distance : null };
}

function getUserContext(query) {
  return { lat: parseFloat(query.lat) || null, lon: parseFloat(query.lon) || null, search: query.search || '' };
}

// ⚠️ PLUS DE DONNÉES SIMULÉES - Base vierge
async function initDB() {
  await pool.query('CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, description TEXT, image TEXT, stock INTEGER DEFAULT 1, category VARCHAR(100), location VARCHAR(255), lat DECIMAL(10,7), lon DECIMAL(10,7), view_count INTEGER DEFAULT 0, message_count INTEGER DEFAULT 0, save_count INTEGER DEFAULT 0, seller_id INTEGER, seller_name VARCHAR(255), created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), phone VARCHAR(50), city VARCHAR(255), avatar TEXT, response_rate DECIMAL(3,2) DEFAULT 0.50, role VARCHAR(20) DEFAULT \'customer\')');
  await pool.query('CREATE TABLE IF NOT EXISTS cart_items (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), quantity INTEGER DEFAULT 1)');
  await pool.query('CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), sender_id INTEGER REFERENCES users(id), receiver_id INTEGER REFERENCES users(id), content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE IF NOT EXISTS ratings (id SERIAL PRIMARY KEY, seller_id INTEGER REFERENCES users(id), buyer_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), score INTEGER CHECK(score >= 1 AND score <= 5), comment TEXT, created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), type VARCHAR(50), title VARCHAR(255), message TEXT, is_read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE IF NOT EXISTS product_views (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), user_id INTEGER, viewed_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE IF NOT EXISTS product_saves (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), user_id INTEGER, saved_at TIMESTAMP DEFAULT NOW())');

  // Seulement l'admin, pas de produits simulés
  var existingAdmin = await pool.query("SELECT * FROM users WHERE email = 'admin@shop.com'");
  if (existingAdmin.rows.length === 0) {
    var hash = await bcrypt.hash('123456', 10);
    await pool.query('INSERT INTO users (email, password, first_name, response_rate, role) VALUES ($1,$2,$3,$4,$5)', ['admin@shop.com', hash, 'Admin', 0.95, 'admin']);
  }
  console.log('Base de données prête (vierge)');
}
initDB().catch(console.error);

// === ROUTES (identiques) ===
app.get('/', function(req, res) { res.json({ status: 'success', message: 'MarchéDirect API' }); });

app.get('/api/v1/products', async function(req, res) {
  try {
    var context = getUserContext(req.query);
    var result = await pool.query('SELECT p.*, COALESCE(AVG(r.score)::numeric(2,1), 0) as seller_rating_avg, COUNT(r.id)::integer as seller_rating_count, u.response_rate as seller_response_rate FROM products p LEFT JOIN ratings r ON p.seller_id = r.seller_id LEFT JOIN users u ON p.seller_id = u.id GROUP BY p.id, u.response_rate ORDER BY p.created_at DESC LIMIT 200');
    var products = result.rows.map(function(p) {
      var rank = computeMarketplaceRank(p, context);
      p.marketplace_rank = rank.final_score;
      p.distance_km = rank.distance_km;
      return p;
    });
    products.sort(function(a, b) { return b.marketplace_rank - a.marketplace_rank; });
    res.json({ status: 'success', algorithm: 'MarchéDirect Rank', data: { products: products } });
  } catch (err) { res.status(500).json({ status: 'error' }); }
});

app.get('/api/v1/products/:id', async function(req, res) {
  await pool.query('UPDATE products SET view_count = view_count + 1 WHERE id = $1', [req.params.id]);
  var result = await pool.query('SELECT p.*, COALESCE(AVG(r.score)::numeric(2,1), 0) as seller_rating_avg FROM products p LEFT JOIN ratings r ON p.seller_id = r.seller_id WHERE p.id = $1 GROUP BY p.id', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ status: 'fail' });
  res.json({ status: 'success', data: { product: result.rows[0] } });
});

app.post('/api/v1/products', authMiddleware, upload.single('image'), async function(req, res) {
  try {
    var imageUrl = req.file ? req.file.path : null;
    var result = await pool.query('INSERT INTO products (name, price, description, image, category, location, lat, lon, seller_id, seller_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *', [req.body.name, req.body.price, req.body.description, imageUrl, req.body.category, req.body.location, req.body.lat || null, req.body.lon || null, req.user.id, req.user.email]);
    res.status(201).json({ status: 'success', data: { product: result.rows[0] } });
  } catch (err) { res.status(500).json({ status: 'error' }); }
});

app.get('/api/v1/users/:id/products', async function(req, res) {
  var result = await pool.query('SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC', [req.params.id]);
  res.json({ status: 'success', data: { products: result.rows } });
});

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
  res.json({ status: 'success', data: { user: result.rows[0], token: token } });
});

app.get('/api/v1/messages/:productId', authMiddleware, async function(req, res) {
  var result = await pool.query('SELECT m.*, u.first_name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.product_id = $1 AND (m.sender_id = $2 OR m.receiver_id = $2) ORDER BY m.created_at ASC', [req.params.productId, req.user.id]);
  res.json({ status: 'success', data: { messages: result.rows } });
});

app.post('/api/v1/messages', authMiddleware, async function(req, res) {
  await pool.query('UPDATE products SET message_count = message_count + 1 WHERE id = $1', [req.body.product_id]);
  var result = await pool.query('INSERT INTO messages (product_id, sender_id, receiver_id, content) VALUES ($1,$2,$3,$4) RETURNING *', [req.body.product_id, req.user.id, req.body.receiver_id, req.body.content]);
  res.status(201).json({ status: 'success', data: { message: result.rows[0] } });
});

app.post('/api/v1/ratings', authMiddleware, async function(req, res) {
  var result = await pool.query('INSERT INTO ratings (seller_id, buyer_id, product_id, score, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *', [req.body.seller_id, req.user.id, req.body.product_id, req.body.score, req.body.comment]);
  res.status(201).json({ status: 'success', data: { rating: result.rows[0] } });
});

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

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() { console.log('Server running on port ' + PORT); });
