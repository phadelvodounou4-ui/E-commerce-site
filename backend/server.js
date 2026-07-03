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

// Distance Haversine
function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

// 🔥 ALGORITHME MARCHÉDIRECT RANK (inspiré Facebook Marketplace)
function computeMarketplaceRank(product, userContext) {
  var score = 0;
  var details = {};

  // 1. PROXIMITÉ (40 points) - Le plus important comme Facebook
  var distance = 999;
  if (userContext.lat && userContext.lon && product.lat && product.lon) {
    distance = haversineDistance(userContext.lat, userContext.lon, product.lat, product.lon);
  }
  if (distance < 1) score += 40;
  else if (distance < 5) score += 35;
  else if (distance < 10) score += 30;
  else if (distance < 25) score += 25;
  else if (distance < 50) score += 18;
  else if (distance < 100) score += 10;
  else if (distance < 200) score += 5;
  else score += 1;
  details.proximity = Math.round(score);

  // 2. CORRESPONDANCE RECHERCHE (25 points)
  var matchScore = 0;
  if (userContext.search && product.name) {
    var searchTerms = userContext.search.toLowerCase().split(' ');
    var productText = (product.name + ' ' + (product.description || '') + ' ' + (product.category || '')).toLowerCase();
    searchTerms.forEach(function(term) {
      if (productText.indexOf(term) !== -1) matchScore += 25 / searchTerms.length;
    });
    // Bonus pour correspondance exacte
    if (productText.indexOf(userContext.search.toLowerCase()) !== -1) matchScore = 25;
  } else {
    matchScore = 12.5; // Score moyen si pas de recherche
  }
  score += Math.min(25, matchScore);
  details.search_match = Math.round(Math.min(25, matchScore));

  // 3. QUALITÉ VENDEUR (15 points)
  var sellerScore = 0;
  // Notes (0-5 étoiles → 0-10 points)
  var avgRating = parseFloat(product.seller_rating_avg) || 0;
  var ratingCount = parseInt(product.seller_rating_count) || 0;
  if (ratingCount >= 10) sellerScore += avgRating * 2;
  else if (ratingCount >= 5) sellerScore += avgRating * 1.5;
  else if (ratingCount >= 1) sellerScore += avgRating * 1;
  else sellerScore += 2.5; // Nouveau vendeur : score neutre

  // Taux de réponse (messages répondus)
  var responseRate = parseFloat(product.seller_response_rate) || 0.5;
  sellerScore += responseRate * 5;
  
  score += Math.min(15, sellerScore);
  details.seller_quality = Math.round(Math.min(15, sellerScore));

  // 4. ENGAGEMENT (10 points)
  var engagementScore = 0;
  var views = parseInt(product.view_count) || 0;
  var messages = parseInt(product.message_count) || 0;
  var saves = parseInt(product.save_count) || 0;
  if (views > 100) engagementScore += 4;
  else if (views > 50) engagementScore += 3;
  else if (views > 10) engagementScore += 2;
  else engagementScore += 1;
  if (messages > 5) engagementScore += 3;
  else if (messages > 1) engagementScore += 2;
  if (saves > 5) engagementScore += 3;
  else if (saves > 1) engagementScore += 2;
  score += Math.min(10, engagementScore);
  details.engagement = Math.round(Math.min(10, engagementScore));

  // 5. RÉCENCE (10 points)
  var hoursOld = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60);
  if (hoursOld < 1) score += 10;
  else if (hoursOld < 6) score += 9;
  else if (hoursOld < 24) score += 7;
  else if (hoursOld < 72) score += 5;
  else if (hoursOld < 168) score += 3;
  else score += 1;
  details.recency = Math.round(score) - (details.proximity + details.search_match + details.seller_quality + details.engagement);

  // Bonus : Produit avec photo
  if (product.image) score += 3;
  // Bonus : Prix compétitif (si prix < moyenne catégorie)
  if (parseFloat(product.price) < 100000) score += 2;

  return {
    final_score: Math.round(score),
    distance_km: distance < 999 ? distance : null,
    details: details
  };
}

// Fonction pour obtenir le contexte utilisateur
function getUserContext(query) {
  return {
    lat: parseFloat(query.lat) || null,
    lon: parseFloat(query.lon) || null,
    search: query.search || '',
    category: query.category || '',
    location: query.location || ''
  };
}

async function initDB() {
  await pool.query('DROP TABLE IF EXISTS product_views');
  await pool.query('DROP TABLE IF EXISTS product_saves');
  await pool.query('DROP TABLE IF EXISTS notifications');
  await pool.query('DROP TABLE IF EXISTS ratings');
  await pool.query('DROP TABLE IF EXISTS messages');
  await pool.query('DROP TABLE IF EXISTS cart_items');
  await pool.query('DROP TABLE IF EXISTS products');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query('CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, description TEXT, image TEXT, stock INTEGER DEFAULT 1, category VARCHAR(100), location VARCHAR(255), lat DECIMAL(10,7), lon DECIMAL(10,7), view_count INTEGER DEFAULT 0, message_count INTEGER DEFAULT 0, save_count INTEGER DEFAULT 0, seller_id INTEGER, seller_name VARCHAR(255), created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), phone VARCHAR(50), city VARCHAR(255), avatar TEXT, response_rate DECIMAL(3,2) DEFAULT 0.50, role VARCHAR(20) DEFAULT \'customer\')');
  await pool.query('CREATE TABLE cart_items (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), quantity INTEGER DEFAULT 1)');
  await pool.query('CREATE TABLE messages (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), sender_id INTEGER REFERENCES users(id), receiver_id INTEGER REFERENCES users(id), content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE ratings (id SERIAL PRIMARY KEY, seller_id INTEGER REFERENCES users(id), buyer_id INTEGER REFERENCES users(id), product_id INTEGER REFERENCES products(id), score INTEGER CHECK(score >= 1 AND score <= 5), comment TEXT, created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE notifications (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), type VARCHAR(50), title VARCHAR(255), message TEXT, is_read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE product_views (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), user_id INTEGER, viewed_at TIMESTAMP DEFAULT NOW())');
  await pool.query('CREATE TABLE product_saves (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), user_id INTEGER, saved_at TIMESTAMP DEFAULT NOW())');

  var hash = await bcrypt.hash('123456', 10);
  await pool.query('INSERT INTO users (email, password, first_name, response_rate, role) VALUES ($1,$2,$3,$4,$5)', ['admin@shop.com', hash, 'Admin', 0.95, 'admin']);
  await pool.query('INSERT INTO users (email, password, first_name, response_rate, role) VALUES ($1,$2,$3,$4,$5)', ['vendeur@shop.com', hash, 'Paul', 0.80, 'customer']);

  // Produits demo avec coordonnées Cotonou
  await pool.query("INSERT INTO products (name, price, description, category, location, lat, lon, view_count, message_count, save_count, seller_id, seller_name) VALUES ('Montre Héritage Luxe', 289000, 'Montre de luxe bracelet cuir véritable. Mouvement suisse.', 'Mode', 'Cotonou Centre', 6.3703, 2.3912, 156, 23, 12, 1, 'Admin')");
  await pool.query("INSERT INTO products (name, price, description, category, location, lat, lon, view_count, message_count, save_count, seller_id, seller_name) VALUES ('Sac Atelier Noir Premium', 154500, 'Sac en cuir pleine fleur fabriqué main. Finitions dorées.', 'Mode', 'Cotonou Haie Vive', 6.3654, 2.4180, 89, 15, 8, 1, 'Admin')");
  await pool.query("INSERT INTO products (name, price, description, category, location, lat, lon, view_count, message_count, save_count, seller_id, seller_name) VALUES ('Parfum Ombre Dorée', 78900, 'Eau de parfum notes boisées et ambrées.', 'Autres', 'Cotonou Jonquet', 6.3542, 2.4355, 212, 45, 19, 2, 'Paul')");
  await pool.query("INSERT INTO products (name, price, description, category, location, lat, lon, view_count, save_count, seller_id, seller_name) VALUES ('Écouteurs Sans Fil Pro', 45000, 'Bluetooth 5.3, autonomie 40h, réduction de bruit.', 'Électronique', 'Cotonou St Michel', 6.3610, 2.4080, 320, 28, 2, 'Paul')");
  await pool.query("INSERT INTO products (name, price, description, category, location, lat, lon, view_count, seller_id, seller_name) VALUES ('Canapé Design Italien', 450000, 'Canapé 3 places en cuir blanc. État neuf.', 'Maison', 'Cotonou Fidjrossè', 6.3500, 2.3800, 67, 1, 'Admin')");

  // Quelques notations
  await pool.query('INSERT INTO ratings (seller_id, buyer_id, product_id, score, comment) VALUES (1, 2, 1, 5, \'Excellent vendeur !\')');
  await pool.query('INSERT INTO ratings (seller_id, buyer_id, product_id, score, comment) VALUES (1, 2, 2, 4, \'Bon produit\')');
  await pool.query('INSERT INTO ratings (seller_id, buyer_id, product_id, score, comment) VALUES (2, 1, 3, 5, \'Parfait !\')');

  console.log('Base de données initialisée avec 5 produits et notations');
}
initDB().catch(console.error);

// === ROUTES ===

app.get('/', function(req, res) { res.json({ status: 'success' }); });

// 🔥 ROUTE PRINCIPALE : Marketplace Rank Algorithm
app.get('/api/v1/products', async function(req, res) {
  try {
    var context = getUserContext(req.query);
    var sort = req.query.sort || 'marketplace_rank';

    // Récupérer tous les produits avec stats vendeur
    var result = await pool.query(
      'SELECT p.*, ' +
      'COALESCE(AVG(r.score)::numeric(2,1), 0) as seller_rating_avg, ' +
      'COUNT(r.id)::integer as seller_rating_count, ' +
      'u.response_rate as seller_response_rate ' +
      'FROM products p ' +
      'LEFT JOIN ratings r ON p.seller_id = r.seller_id ' +
      'LEFT JOIN users u ON p.seller_id = u.id ' +
      'WHERE 1=1 ' +
      (context.search ? 'AND (p.name ILIKE $1 OR p.description ILIKE $1) ' : '') +
      (context.category ? 'AND p.category = $' + (context.search ? '2' : '1') + ' ' : '') +
      'GROUP BY p.id, u.response_rate ' +
      'ORDER BY p.created_at DESC LIMIT 200',
      context.search ? (context.category ? ['%' + context.search + '%', context.category] : ['%' + context.search + '%']) : (context.category ? [context.category] : [])
    );

    var products = result.rows;

    // Appliquer l'algorithme Marketplace Rank à chaque produit
    products = products.map(function(p) {
      var rank = computeMarketplaceRank(p, context);
      p.marketplace_rank = rank.final_score;
      p.distance_km = rank.distance_km;
      p.rank_details = rank.details;
      return p;
    });

    // Trier par Marketplace Rank
    if (sort === 'marketplace_rank') {
      products.sort(function(a, b) { return b.marketplace_rank - a.marketplace_rank; });
    } else if (sort === 'price_asc') {
      products.sort(function(a, b) { return parseFloat(a.price) - parseFloat(b.price); });
    } else if (sort === 'price_desc') {
      products.sort(function(a, b) { return parseFloat(b.price) - parseFloat(a.price); });
    } else if (sort === 'distance') {
      products.sort(function(a, b) { return (a.distance_km || 999) - (b.distance_km || 999); });
    }

    res.json({
      status: 'success',
      algorithm: 'MarchéDirect Rank (inspiré Facebook Marketplace)',
      context: { search: context.search, user_location: context.lat ? { lat: context.lat, lon: context.lon } : null },
      data: { products: products }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Produits similaires (recommandations)
app.get('/api/v1/products/:id/recommendations', async function(req, res) {
  try {
    var product = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (product.rows.length === 0) return res.status(404).json({ status: 'fail' });
    var p = product.rows[0];
    var result = await pool.query(
      'SELECT p.*, COALESCE(AVG(r.score)::numeric(2,1), 0) as seller_rating_avg FROM products p LEFT JOIN ratings r ON p.seller_id = r.seller_id WHERE p.id != $1 AND (p.category = $2 OR p.location ILIKE $3) GROUP BY p.id ORDER BY p.view_count DESC LIMIT 6',
      [p.id, p.category, '%' + (p.location || '').split(' ')[0] + '%']
    );
    res.json({ status: 'success', data: { recommendations: result.rows } });
  } catch (err) { res.status(500).json({ status: 'error' }); }
});

// Proximité
app.get('/api/v1/products/nearby', async function(req, res) {
  var lat = parseFloat(req.query.lat) || 6.3703;
  var lon = parseFloat(req.query.lon) || 2.3912;
  var radius = parseInt(req.query.radius) || 50;
  var result = await pool.query('SELECT p.*, COALESCE(AVG(r.score)::numeric(2,1), 0) as seller_rating_avg FROM products p LEFT JOIN ratings r ON p.seller_id = r.seller_id GROUP BY p.id');
  var nearby = result.rows.map(function(p) {
    if (p.lat && p.lon) p.distance_km = haversineDistance(lat, lon, p.lat, p.lon);
    else p.distance_km = 999;
    return p;
  }).filter(function(p) { return p.distance_km <= radius; });
  nearby.sort(function(a, b) { return a.distance_km - b.distance_km; });
  res.json({ status: 'success', data: { products: nearby, center: { lat: lat, lon: lon }, radius_km: radius } });
});

// Vue produit (incrémente le compteur)
app.get('/api/v1/products/:id', async function(req, res) {
  await pool.query('UPDATE products SET view_count = view_count + 1 WHERE id = $1', [req.params.id]);
  var result = await pool.query('SELECT p.*, COALESCE(AVG(r.score)::numeric(2,1), 0) as seller_rating_avg, COUNT(r.id)::integer as seller_rating_count FROM products p LEFT JOIN ratings r ON p.seller_id = r.seller_id WHERE p.id = $1 GROUP BY p.id', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ status: 'fail' });
  // Enregistrer la vue
  await pool.query('INSERT INTO product_views (product_id) VALUES ($1)', [req.params.id]);
  res.json({ status: 'success', data: { product: result.rows[0] } });
});

// Créer un produit
app.post('/api/v1/products', authMiddleware, upload.single('image'), async function(req, res) {
  try {
    var imageUrl = req.file ? req.file.path : null;
    var result = await pool.query('INSERT INTO products (name, price, description, image, category, location, lat, lon, seller_id, seller_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *', [req.body.name, req.body.price, req.body.description, imageUrl, req.body.category, req.body.location, req.body.lat, req.body.lon, req.user.id, req.user.email]);
    res.status(201).json({ status: 'success', data: { product: result.rows[0] } });
  } catch (err) { res.status(500).json({ status: 'error' }); }
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
  res.json({ status: 'success', data: { user: result.rows[0], token: token } });
});

// Messages, Ratings, Notifications, Panier, Admin (conservés)
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
