'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

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
    if (editingId) {
      await axios.put(`${API}/admin/products/${editingId}`, form);
    } else {
      await axios.post(`${API}/admin/products`, form);
    }
    setShowForm(false);
    setForm({ name: '', price: '', description: '', stock: '' });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (p: any) => {
    setForm({ name: p.name, price: p.price, description: p.description || '', stock: String(p.stock || 0) });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      await axios.delete(`${API}/admin/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={28} /> Administration
        </h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', price: '', description: '', stock: '' }); }} style={{
          background: '#1e293b', color: 'white', border: 'none', padding: '12px 24px',
          borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600'
        }}>
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '25px', borderRadius: '14px', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', display: 'grid', gap: '12px' }}>
          <input placeholder="Nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }} />
          <input placeholder="Prix" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }} />
          <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ flex: 1, background: '#1e293b', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
              {editingId ? 'Modifier' : 'Ajouter'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Annuler</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {products.map(product => (
          <div key={product.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div>
              <h3 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '3px' }}>{product.name}</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>{parseFloat(product.price).toFixed(2)} € | Stock: {product.stock}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(product)} style={{ background: '#eff6ff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                <Edit2 size={14} /> Modifier
              </button>
              <button onClick={() => handleDelete(product.id)} style={{ background: '#fef2f2', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
