'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ShoppingCart, Star, ChevronRight } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${API}/products`).then(res => setProducts(res.data.data.products));
  }, []);

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>🛍️ ShopHub</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px', opacity: 0.9 }}>Votre boutique en ligne avec les meilleurs produits</p>
        <Link href="/products" style={{
          background: 'white', color: '#2563eb', padding: '15px 40px', borderRadius: '50px',
          fontWeight: 'bold', fontSize: '18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px'
        }}>
          Voir tous les produits <ChevronRight size={20} />
        </Link>
      </section>

      <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
          ✨ Nos Produits
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer'
              }}>
                <div style={{ height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>🛒</div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ color: '#666', fontSize: '14px' }}>4.5</span>
                  </div>
                  <p style={{ color: '#999', fontSize: '14px', marginBottom: '10px' }}>{product.description?.substring(0, 80)}...</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{parseFloat(product.price).toFixed(2)} €</span>
                    <button style={{
                      background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px',
                      borderRadius: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: 'bold'
                    }}>
                      <ShoppingCart size={16} /> Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer style={{ background: '#1e3a8a', color: 'white', textAlign: 'center', padding: '30px', marginTop: '60px' }}>
        <p style={{ margin: 0, opacity: 0.8 }}>© 2026 ShopHub - Tous droits réservés</p>
        <p style={{ margin: '5px 0 0 0', opacity: 0.6, fontSize: '14px' }}>Contact : contact@shophub.com | Livraison gratuite dès 50€</p>
      </footer>
    </div>
  );
}
