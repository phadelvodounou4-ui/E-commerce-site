'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/products`).then(res => { setProducts(res.data.data.products); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <Link href="/" className="text-sm font-semibold text-[#1877F2] hover:underline">← Retour</Link>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold mb-6">Tous les produits</h1>
        {loading ? <p className="text-[#606770]">Chargement...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {products.map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group bg-white rounded-xl border border-black/[0.08] overflow-hidden hover:shadow-lg transition-shadow no-underline">
                <div className="aspect-square bg-[#f0f2f5] flex items-center justify-center text-7xl group-hover:scale-105 transition-transform">{p.image || '🛒'}</div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 text-[#1c1e21] truncate">{p.name}</h3>
                  <p className="text-xs text-[#606770] mb-2">{p.description?.substring(0, 60)}...</p>
                  <span className="text-lg font-extrabold text-[#1c1e21]">{parseFloat(p.price).toFixed(2)} €</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
