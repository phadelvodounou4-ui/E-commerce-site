'use client';
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function SellPage() {
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', location: '', seller_name: '' });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setForm({ ...form, location: data.display_name?.split(',').slice(0, 3).join(',') || `${latitude}, ${longitude}` });
        } catch {
          setForm({ ...form, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
        }
      });
    } else {
      alert('Géolocalisation non supportée');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', form.price);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('location', form.location);
    fd.append('seller_name', form.seller_name);
    if (image) fd.append('image', image);

    try {
      await axios.post(`${API}/products`, fd);
      setSuccess(true);
    } catch (err) {
      alert('Erreur lors de la publication');
    }
    setLoading(false);
  };

  if (success) return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="bg-white rounded-2xl border border-black/[0.08] p-10 text-center max-w-md">
        <span className="text-6xl">🎉</span>
        <h2 className="text-2xl font-extrabold mt-4 mb-2">Annonce publiée !</h2>
        <p className="text-[#606770] mb-6">Votre produit est maintenant en ligne.</p>
        <Link href="/" className="px-6 py-3 rounded-full bg-[#1877F2] text-white font-semibold hover:bg-[#166fe0]">Retour à l'accueil</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <Link href="/" className="text-sm font-semibold text-[#1877F2] hover:underline">← Retour</Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold mb-6">📸 Publier une annonce</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/[0.08] p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Photo du produit</label>
            <input type="file" accept="image/*" capture="environment" onChange={handleImage} className="w-full text-sm" />
            {preview && <img src={preview} alt="Preview" className="mt-3 rounded-xl w-full h-48 object-cover" />}
          </div>
          <input placeholder="Nom du produit *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-3 border border-black/10 rounded-xl text-sm" />
          <input placeholder="Prix (FCFA) *" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full px-4 py-3 border border-black/10 rounded-xl text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-3 border border-black/10 rounded-xl text-sm" />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 border border-black/10 rounded-xl text-sm">
            <option value="">Catégorie</option>
            <option value="Électronique">Électronique</option>
            <option value="Mode">Mode</option>
            <option value="Maison">Maison</option>
            <option value="Véhicules">Véhicules</option>
            <option value="Autres">Autres</option>
          </select>
          <div className="flex gap-2">
            <input placeholder="Localisation" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="flex-1 px-4 py-3 border border-black/10 rounded-xl text-sm" />
            <button type="button" onClick={getLocation} className="px-4 py-3 rounded-xl bg-[#e7f0ff] text-[#1877F2] font-semibold text-sm">📍</button>
          </div>
          <input placeholder="Votre nom" value={form.seller_name} onChange={e => setForm({...form, seller_name: e.target.value})} className="w-full px-4 py-3 border border-black/10 rounded-xl text-sm" />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#1877F2] text-white font-semibold hover:bg-[#166fe0] disabled:opacity-50">
            {loading ? 'Publication...' : '📢 Publier l\'annonce'}
          </button>
        </form>
      </div>
    </div>
  );
}
