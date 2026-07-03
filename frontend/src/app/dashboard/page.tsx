'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      axios.get(`${API}/users/${u.id}/products`).then(res => setProducts(res.data.data.products)).catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <div className="flex gap-3">
            <Link href="/sell" className="px-4 py-2 rounded-full bg-[#1877F2] text-white text-sm font-semibold">+ Vendre</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-black/[0.08] p-6 mb-6">
          <h1 className="text-2xl font-extrabold mb-2">👤 {user?.first_name || 'Utilisateur'}</h1>
          <p className="text-[#606770]">{user?.email} • {user?.city || 'Localisation non définie'}</p>
        </div>

        <h2 className="text-xl font-extrabold mb-4">📦 Mes annonces ({products.length})</h2>
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/[0.08] p-10 text-center">
            <p className="text-[#606770] mb-4">Vous n'avez pas encore publié d'annonce.</p>
            <Link href="/sell" className="px-6 py-3 rounded-full bg-[#1877F2] text-white font-semibold">Publier ma première annonce</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="bg-white rounded-xl border border-black/[0.08] overflow-hidden">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-[#f0f2f5] flex items-center justify-center text-5xl">📦</div>}
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                  <p className="text-[#606770] text-xs mb-1">{p.location}</p>
                  <span className="text-lg font-extrabold">{p.price} FCFA</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
