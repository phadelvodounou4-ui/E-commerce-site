export default function Home() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '100px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1e293b' }}>🛍️ ShopHub</h1>
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '30px' }}>Votre boutique en ligne</p>
      <a href="/products" style={{
        background: '#2563eb', color: 'white', padding: '14px 35px',
        borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '16px'
      }}>Voir les produits</a>
    </div>
  );
}
