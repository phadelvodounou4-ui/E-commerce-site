'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ShoppingCart, Star, ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartMsg, setCartMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(res => { setProducts(res.data.data.products); setLoading(false); })
      .catch(() => {
        setProducts([
          { id: 1, name: 'Écouteurs Bluetooth', price: '29.99', description: 'Sans fil, autonomie 20h' },
          { id: 2, name: 'Montre Connectée', price: '59.99', description: 'Cardio, GPS, étanche' },
          { id: 3, name: 'Chargeur USB-C', price: '19.99', description: 'Charge rapide 65W' },
        ]);
        setLoading(false);
      });
  }, []);

  const addToCart = async (productId: number) => {
    await axios.post(`${API}/cart`, { productId, quantity: 1 }, { headers: { 'user-id': '1' } });
    setCartMsg('Ajouté au panier !');
    setTimeout(() => setCartMsg(''), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {cartMsg && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', zIndex: 1000, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          ✅ {cartMsg}
        </div>
      )}
      
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)', color: 'white', textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', marginBottom: '20px' }}>✨ Nouvelle collection</div>
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '15px', lineHeight: 1.2 }}>L'excellence à<br />portée de clic</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '35px' }}>Découvrez des produits soigneusement sélectionnés.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" style={{ background: 'white', color: '#1e3a8a', padding: '14px 35px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', textDecoration: 'none' }}>Explorer <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} /></Link>
            <Link href="/cart" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 35px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)' }}>🛒 Panier</Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '30px', textAlign: 'center' }}>🌟 Nos Produits</h2>
        {loading ? <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Chargement...</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {products.map(product => (
              <div key={product.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ height: '200px', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
                    {product.id === 1 ? '🎧' : product.id === 2 ? '⌚' : '🔌'}
                  </div>
                </Link>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />)}
                  </div>
                  <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>{product.name}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>{product.description}</p>
                  </Link>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>{parseFloat(product.price).toFixed(2)} €</span>
                    <button onClick={() => addToCart(product.id)} style={{ background: '#1e293b', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '600', fontSize: '14px' }}>
                      <ShoppingCart size={16} /> Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer style={{ background: '#0f172a', color: 'white', textAlign: 'center', padding: '30px', marginTop: '80px' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>🛍️ ShopHub</p>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>© 2026 Tous droits réservés.</p>
      </footer>
    </div>
  );
}
