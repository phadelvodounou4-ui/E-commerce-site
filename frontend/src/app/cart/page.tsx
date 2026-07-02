'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, ArrowRight } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/cart`, { headers: { 'user-id': '1' } });
      setItems(res.data.data.items);
      setTotal(res.data.data.total);
    } catch (e) { setItems([]); }
    setLoading(false);
  };

  const removeItem = async (id: number) => {
    await axios.delete(`${API}/cart/${id}`);
    fetchCart();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>🛒 Mon Panier</h1>
        <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ArrowLeft size={16} /> Continuer mes achats
        </Link>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
          <ShoppingBag size={64} color="#94a3b8" />
          <h2 style={{ color: '#64748b', marginTop: '15px' }}>Votre panier est vide</h2>
          <Link href="/products" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', marginTop: '10px', display: 'inline-block' }}>Voir les produits</Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {items.map(item => (
              <div key={item.id} style={{ background: 'white', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '50px', minWidth: '70px', textAlign: 'center' }}>{item.image || '🛒'}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>{item.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '14px' }}>Qté: {item.quantity}</p>
                </div>
                <div style={{ fontWeight: '800', fontSize: '18px', color: '#1e293b' }}>
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                </div>
                <button onClick={() => removeItem(item.id)} style={{ background: '#fef2f2', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '25px', marginTop: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#64748b' }}>Sous-total</span>
              <span style={{ fontWeight: '600' }}>{total} €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#64748b' }}>Livraison</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>Gratuite</span>
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '800', fontSize: '18px' }}>Total</span>
              <span style={{ fontWeight: '800', fontSize: '20px', color: '#1e293b' }}>{total} €</span>
            </div>
            <button style={{
              width: '100%', marginTop: '20px', background: '#1e293b', color: 'white',
              border: 'none', padding: '16px', borderRadius: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              fontWeight: '700', fontSize: '16px'
            }}>
              Commander <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
