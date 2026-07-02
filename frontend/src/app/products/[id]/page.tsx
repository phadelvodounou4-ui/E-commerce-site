'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ShoppingCart, Star, ArrowLeft, Truck, Shield, RotateCcw, Minus, Plus, Heart } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    axios.get(`${API}/products/${id}`)
      .then(res => { setProduct(res.data.data.product); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>Chargement...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '80px' }}>Produit non trouvé</div>;

  const emoji = product.id === 1 ? '🎧' : product.id === 2 ? '⌚' : '🔌';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Fil d'Ariane */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
        <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>Accueil</Link>
        <span>/</span>
        <Link href="/products" style={{ color: '#3b82f6', textDecoration: 'none' }}>Produits</Link>
        <span>/</span>
        <span style={{ color: '#1e293b' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        
        {/* IMAGE */}
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          borderRadius: '24px',
          height: '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '150px',
          position: 'relative'
        }}>
          {emoji}
          <button style={{
            position: 'absolute', top: '15px', right: '15px',
            background: 'white', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <Heart size={20} color="#ef4444" />
          </button>
        </div>

        {/* INFOS */}
        <div>
          <div style={{
            display: 'inline-block', background: '#fef3c7', color: '#92400e',
            padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '15px'
          }}>
            En stock ({product.stock} disponibles)
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            <span style={{ color: '#64748b', fontSize: '14px', marginLeft: '5px' }}>4.8 (128 avis)</span>
          </div>

          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.7, marginBottom: '25px' }}>
            {product.description}
          </p>

          <div style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', marginBottom: '25px' }}>
            {parseFloat(product.price).toFixed(2)} €
            <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400', marginLeft: '8px' }}>TTC</span>
          </div>

          {/* Quantité */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>Quantité :</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{
                padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'
              }}><Minus size={18} /></button>
              <span style={{ padding: '12px 20px', fontWeight: '600', borderLeft: '2px solid #e2e8f0', borderRight: '2px solid #e2e8f0' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{
                padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'
              }}><Plus size={18} /></button>
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
            <button onClick={handleAddToCart} style={{
              flex: 1, background: addedToCart ? '#16a34a' : '#1e293b', color: 'white',
              border: 'none', padding: '16px 30px', borderRadius: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              fontWeight: '700', fontSize: '16px', transition: 'all 0.3s'
            }}>
              <ShoppingCart size={20} />
              {addedToCart ? '✓ Ajouté !' : 'Ajouter au panier'}
            </button>
            <button onClick={() => router.push('/products')} style={{
              padding: '16px 24px', background: '#f1f5f9', border: 'none',
              borderRadius: '14px', cursor: 'pointer', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <ArrowLeft size={18} /> Retour
            </button>
          </div>

          {/* Garanties */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', borderTop: '1px solid #e2e8f0', paddingTop: '25px' }}>
            {[
              { icon: <Truck size={20} />, text: 'Livraison gratuite' },
              { icon: <Shield size={20} />, text: 'Paiement sécurisé' },
              { icon: <RotateCcw size={20} />, text: 'Retour 30 jours' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ color: '#3b82f6', marginBottom: '5px' }}>{item.icon}</div>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
