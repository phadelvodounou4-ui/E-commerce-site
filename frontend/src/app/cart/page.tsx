'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState('0');

  useEffect(() => {
    axios.get(`${API}/cart`, { headers: { 'user-id': '1' } }).then(res => { setItems(res.data.data.items); setTotal(res.data.data.total); }).catch(() => {});
  }, []);

  const removeItem = async (id: number) => {
    await axios.delete(`${API}/cart/${id}`);
    const res = await axios.get(`${API}/cart`, { headers: { 'user-id': '1' } });
    setItems(res.data.data.items);
    setTotal(res.data.data.total);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <Link href="/" className="text-sm font-semibold text-[#1877F2] hover:underline">← Continuer mes achats</Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold mb-6">🛒 Mon Panier</h1>
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-black/[0.08] p-10 text-center">
            <p className="text-[#606770] text-lg mb-4">Votre panier est vide</p>
            <Link href="/products" className="text-[#1877F2] font-semibold hover:underline">Voir les produits</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="bg-white rounded-xl border border-black/[0.08] p-5 flex items-center gap-4">
                <span className="text-4xl">{item.image || '🛒'}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-[#606770]">Qté: {item.quantity}</p>
                </div>
                <span className="font-extrabold text-lg">{(parseFloat(item.price) * item.quantity).toFixed(2)} €</span>
                <button onClick={() => removeItem(item.id)} className="text-[#e41e3f] hover:bg-[#fef2f2] px-3 py-2 rounded-lg font-semibold text-sm">Supprimer</button>
              </div>
            ))}
            <div className="bg-white rounded-xl border border-black/[0.08] p-5">
              <div className="flex justify-between text-lg font-extrabold"><span>Total</span><span>{total} €</span></div>
              <button className="w-full mt-4 py-3 rounded-lg bg-[#1877F2] text-white font-semibold hover:bg-[#166fe0] transition-colors">Commander</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
