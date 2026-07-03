'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { User, Package, MapPin, Plus } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <Link href="/sell" className="px-4 py-2 rounded-full bg-[#1877F2] text-white text-sm font-semibold flex items-center gap-1">
            <Plus size={16} /> Vendre
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Profil */}
        <div className="bg-white rounded-2xl border border-black/[0.08] p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-[#e7f0ff] flex items-center justify-center text-2xl">
              <User size={28} className="text-[#1877F2]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold">{user?.first_name || 'Utilisateur'}</h1>
              <p className="text-sm text-[#606770]">{user?.email || 'Non connecté'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#606770]">
            <MapPin size={14} />
            <span>{user?.city || 'Localisation non définie'}</span>
          </div>
        </div>

        {/* Annonces */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Package size={20} /> Mes annonces ({products.length})
            </h2>
            <Link href="/sell" className="text-sm font-semibold text-[#1877F2] hover:underline">+ Publier</Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/[0.08] p-10 text-center">
              <Package size={48} className="mx-auto text-[#ccc] mb-4" />
              <p className="text-[#606770] mb-4">Vous n&apos;avez pas encore publié d&apos;annonce.</p>
              <Link href="/sell" className="inline-block px-6 py-3 rounded-full bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166fe0]">
                Publier ma première annonce
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p: any) => (
                <div key={p.id} className="bg-white rounded-xl border border-black/[0.08] overflow-hidden hover:shadow-md transition-shadow">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-[#f0f2f5] flex items-center justify-center text-5xl">📦</div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                    <p className="text-[#606770] text-xs mb-2 flex items-center gap-1">
                      <MapPin size={10} /> {p.location || 'Non défini'}
                    </p>
                    <span className="text-lg font-extrabold">{p.price} FCFA</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
