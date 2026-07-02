const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'API is running' });
});

// Route produits (statique, sans base de données)
app.get('/api/v1/products', (req, res) => {
  const products = [
    { id: 1, name: 'Écouteurs Bluetooth', price: 29.99, description: 'Sans fil, autonomie 20h', image: 'https://picsum.photos/200', stock: 50 },
    { id: 2, name: 'Montre connectée', price: 59.99, description: 'Cardio, GPS, étanche', image: 'https://picsum.photos/201', stock: 30 },
    { id: 3, name: 'Chargeur rapide USB-C', price: 19.99, description: 'Compatible tous appareils', image: 'https://picsum.photos/202', stock: 100 },
  ];
  res.json({ status: 'success', data: { products, pagination: { page: 1, limit: 20, total: 3, pages: 1 } } });
});

// Route login simplifiée
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@shop.com' && password === '123456') {
    res.json({ status: 'success', data: { user: { id: '1', email: 'admin@shop.com', firstName: 'Admin', role: 'admin' }, token: 'fake-token-123' } });
  } else {
    res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
  }
});

// Route register simplifiée
app.post('/api/v1/auth/register', (req, res) => {
  res.status(201).json({ status: 'success', message: 'Account created', data: { user: { id: '2', email: req.body.email }, token: 'fake-token-456' } });
});

// Route panier
app.get('/api/v1/cart', (req, res) => {
  res.json({ status: 'success', data: { items: [], itemCount: 0, total: 0 } });
});

app.post('/api/v1/cart', (req, res) => {
  res.json({ status: 'success', message: 'Added to cart', data: { item: { id: '1', quantity: 1, product: { id: req.body.productId, name: 'Produit test', price: 29.99 } } } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
