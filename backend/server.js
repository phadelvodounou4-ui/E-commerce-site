const fs = require('fs');
fs.mkdirSync('logs', { recursive: true });

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { connectDatabase } = require('./src/config/database');
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');
require('./src/models/category.model');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'Server is healthy' });
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Email et mot de passe requis' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ status: 'fail', message: 'Un compte existe déjà avec cet email' });
    }
    const user = await User.create({ email, passwordHash: password, firstName, lastName, role: 'customer' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ status: 'success', data: { user, token } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ status: 'fail', message: 'Identifiants invalides' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ status: 'fail', message: 'Identifiants invalides' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ status: 'success', data: { user, token } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/v1/products', async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'active' } });
    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      description: p.description,
      image: (p.images && p.images[0]) || 'https://picsum.photos/200',
      stock: p.stockQuantity,
    }));
    res.json({ status: 'success', data: { products: data, pagination: { page: 1, limit: 20, total: data.length, pages: 1 } } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/v1/cart', (req, res) => {
  res.json({ status: 'success', data: { items: [], itemCount: 0, total: 0 } });
});

app.post('/api/v1/cart', (req, res) => {
  res.json({ status: 'success', message: 'Added to cart', data: { item: { id: '1', quantity: 1, product: { id: req.body.productId, name: 'Produit test', price: 29.99 } } } });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDatabase();

    let admin = await User.findOne({ where: { email: 'admin@shop.com' } });
    if (!admin) {
      admin = await User.create({ email: 'admin@shop.com', passwordHash: '123456', firstName: 'Admin', role: 'admin', isVerified: true });
      console.log('Compte admin créé : admin@shop.com / 123456');
    }

    const count = await Product.count();
    if (count === 0) {
      await Product.bulkCreate([
        { sellerId: admin.id, name: 'Écouteurs Bluetooth', price: 29.99, description: 'Sans fil, autonomie 20h', images: ['https://picsum.photos/200'], stockQuantity: 50, status: 'active' },
        { sellerId: admin.id, name: 'Montre connectée', price: 59.99, description: 'Cardio, GPS, étanche', images: ['https://picsum.photos/201'], stockQuantity: 30, status: 'active' },
        { sellerId: admin.id, name: 'Chargeur rapide USB-C', price: 19.99, description: 'Compatible tous appareils', images: ['https://picsum.photos/202'], stockQuantity: 100, status: 'active' },
      ]);
      console.log('Produits de démonstration ajoutés');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Erreur au démarrage :', err.message);
    process.exit(1);
  }
}

start();
