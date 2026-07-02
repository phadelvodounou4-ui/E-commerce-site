'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ShoppingCart, Star, ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(res => {
        setProducts(res.data.data.products);
        setLoading(false);
      })
      .catch(() => {
        setProducts([
          { id: 1, name: 'Écouteurs Bluetooth', price: '29.99', description: 'Sans fil, autonomie 20h, son cristallin.' },
          { id: 2, name: 'Montre Connectée', price: '59.99', description: 'Cardio, GPS, étanche, notifications.' },
          { id: 3, name: 'Chargeur USB-C Rapide', price: '19.99', description: 'Compatible tous appareils, charge rapide.' },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            ✨ Nouvelle collection disponible
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '15px', lineHeight: 1.2 }}>
            L'excellence à<br />portée de clic
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '35px', lineHeight: 1.6 }}>
            Découvrez des produits soigneusement sélectionnés. Livraison rapide, paiement sécurisé.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" style={{
              background: 'white', color: '#1e3a8a', padding: '14px 35px',
              borderRadius: '12px', fontWeight: '700', fontSize: '16px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 20px rgba(255,255,255,0.3)'
            }}>
              Explorer <ArrowRight size={18} />
            </Link>
            <Link href="/login" style={{
              background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 35px',
              borderRadius: '12px', fontWeight: '600', fontSize: '16px',
              textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)'
            }}>
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section style={{
        maxWidth: '1100px', margin: '-40px auto 0',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px', padding: '0 20px', position: 'relative', zIndex: 1
      }}>
        {[
          { icon: <Truck size={24} />, title: 'Livraison Gratuite', desc: 'Dès 50€ d\'achat' },
          { icon: <Shield size={24} />, title: 'Paiement Sécurisé', desc: 'Protection SSL' },
          { icon: <TrendingUp size={24} />, title: 'Qualité Premium', desc: 'Produits vérifiés' },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '16px', padding: '25px',
            textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', color: '#3b82f6' }}>
              {item.icon}
            </div>
            <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b', margin: 0 }}>{item.title}</h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* PRODUITS */}
      <section style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 5px' }}>🌟 Produits tendance</h2>
            <p style={{ color: '#64748b', margin: 0 }}>Les plus populaires cette semaine</p>
          </div>
          <Link href="/products" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Chargement...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {products.map(product => (
              <div key={product.id} style={{
                background: 'white', borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  height: '200px', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px'
                }}>
                  {product.id === 1 ? '🎧' : product.id === 2 ? '⌚' : '🔌'}
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />)}
                    <span style={{ marginLeft: '8px', color: '#94a3b8', fontSize: '13px' }}>4.8</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>{product.name}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', lineHeight: 1.5 }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>
                      {parseFloat(product.price).toFixed(2)} €
                    </span>
                    <button style={{
                      background: '#1e293b', color: 'white', border: 'none',
                      padding: '10px 22px', borderRadius: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      <ShoppingCart size={16} /> Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0f172a', color: 'white', marginTop: '80px' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '40px 20px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px'
        }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>🛍️ ShopHub</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>Votre boutique en ligne de confiance depuis 2026.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>Liens rapides</h4>
            <Link href="/products" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Produits</Link>
            <Link href="/cart" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', display: 'block' }}>Panier</Link>
          </div>
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>Contact</h4>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>contact@shophub.com</p>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '5px 0 0' }}>+33 1 23 45 67 89</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>
          © 2026 ShopHub. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
