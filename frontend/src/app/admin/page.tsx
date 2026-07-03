'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '', stock: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/admin/products`);
    setProducts(res.data.data.products);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) { await axios.put(`${API}/admin/products/${editingId}`, form); }
    else { await axios.post(`${API}/admin/products`, form); }
    setShowForm(false); setForm({ name: '', price: '', description: '', stock: '' }); setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ?')) { await axios.delete(`${API}/admin/products/${id}`); fetchProducts(); }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <span className="text-sm font-semibold text-[#606770]">Admin</span>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold">⚙️ Administration</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', price: '', description: '', stock: '' }); }} className="px-4 py-2 rounded-full bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#166fe0] transition-colors">
            + Ajouter
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-black/[0.08] p-5 mb-6 space-y-3">
            <input placeholder="Nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-2 border border-black/10 rounded-lg text-sm" />
            <input placeholder="Prix" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full px-4 py-2 border border-black/10 rounded-lg text-sm" />
            <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg text-sm" />
            <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg text-sm" />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 rounded-lg bg-[#1877F2] text-white font-semibold text-sm">{editingId ? 'Modifier' : 'Ajouter'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-[#f0f2f5] text-sm">Annuler</button>
            </div>
          </form>
        )}
        <div className="space-y-3">
          {products.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl border border-black/[0.08] p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-[#606770]">{parseFloat(p.price).toFixed(2)} € | Stock: {p.stock}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setForm({ name: p.name, price: p.price, description: p.description || '', stock: String(p.stock) }); setEditingId(p.id); setShowForm(true); }} className="px-3 py-1.5 rounded-lg bg-[#e7f0ff] text-[#1877F2] text-sm font-semibold">Modifier</button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg bg-[#fef2f2] text-[#e41e3f] text-sm font-semibold">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
