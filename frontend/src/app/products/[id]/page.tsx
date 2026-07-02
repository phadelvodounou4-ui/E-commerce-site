'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Données en dur pour éviter les erreurs API
    const products: any = {
      '1': { id: 1, name: 'Écouteurs Bluetooth', price: '29.99', description: 'Sans fil, autonomie 20h, son cristallin. Parfait pour le sport et les appels.', stock: 50, emoji: '🎧' },
      '2': { id: 2, name: 'Montre Connectée', price: '59.99', description: 'Cardio, GPS, étanche, notifications. Suivez votre activité au quotidien.', stock: 30, emoji: '⌚' },
      '3': { id: 3, name: 'Chargeur USB-C Rapide', price: '19.99', description: 'Compatible tous appareils. Charge rapide 65W avec câble inclus.', stock: 100, emoji: '🔌' },
    };
    setProduct(products[id] || null);
  }, [id]);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>😕</h1>
        <h2>Produit non trouvé</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>Ce produit n'existe pas ou a été supprimé.</p>
        <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>← Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Image */}
        <div style={{
          flex: '1 1 350px', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          borderRadius: '24px', height: '380px', minWidth: '280px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px'
        }}>
          {product.emoji}
        </div>

        {/* Infos */}
        <div style={{ flex: '1 1 350px', minWidth: '280px' }}>
          <div style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '15px' }}>
            ✅ En stock ({product.stock} disponibles)
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', gap: '3px', marginBottom: '15px' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            <span style={{ color: '#64748b', marginLeft: '8px', fontSize: '14px' }}>4.8 (128 avis)</span>
          </div>

          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>{product.description}</p>

          <div style={{ fontSize: '34px', fontWeight: '800', marginBottom: '25px' }}>
            {parseFloat(product.price).toFixed(2)} €
            <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400', marginLeft: '8px' }}>TTC</span>
          </div>

          <button style={{
            width: '100%', background: '#1e293b', color: 'white', border: 'none',
            padding: '16px', borderRadius: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontWeight: '700', fontSize: '16px', marginBottom: '25px'
          }}>
            <ShoppingCart size={20} /> Ajouter au panier
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            {['🚚 Livraison gratuite', '🔒 Paiement sécurisé', '🔄 Retour 30 jours'].map((text, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
