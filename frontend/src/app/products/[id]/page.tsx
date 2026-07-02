'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ShoppingCart, Star, ArrowLeft, Truck, Shield, Minus, Plus } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    axios.get(`${API}/products/${id}`)
      .then(res => { setProduct(res.data.data.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}>Chargement...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '80px' }}>Produit non trouvé</div>;

  const emoji = product.id === 1 ? '🎧' : product.id === 2 ? '⌚' : '🔌';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>← Retour</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          borderRadius: '24px', height: '400px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px'
        }}>
          {emoji}
        </div>

        <div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', gap: '3px', marginBottom: '15px' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            <span style={{ color: '#64748b', marginLeft: '8px' }}>4.8 (128 avis)</span>
          </div>

          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>{product.description}</p>

          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px' }}>
            {parseFloat(product.price).toFixed(2)} €
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '10px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', background: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
            <span style={{ fontSize: '18px', fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '10px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', background: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
          </div>

          <button style={{
            width: '100%', background: '#1e293b', color: 'white', border: 'none',
            padding: '14px', borderRadius: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontWeight: '700', fontSize: '16px'
          }}>
            <ShoppingCart size={18} /> Ajouter au panier
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <div style={{ textAlign: 'center' }}><Truck size={20} color="#3b82f6" /><p style={{ fontSize: '11px', color: '#64748b' }}>Livraison gratuite</p></div>
            <div style={{ textAlign: 'center' }}><Shield size={20} color="#3b82f6" /><p style={{ fontSize: '11px', color: '#64748b' }}>Paiement sécurisé</p></div>
            <div style={{ textAlign: 'center' }}><ArrowLeft size={20} color="#3b82f6" /><p style={{ fontSize: '11px', color: '#64748b' }}>Retour 30 jours</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
