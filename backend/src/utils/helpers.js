const crypto = require('crypto');
exports.generateSKU = () => `SKU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
exports.formatPrice = (amount, currency = 'EUR') => new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
exports.slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
