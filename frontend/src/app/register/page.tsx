'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', city: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/register`, form);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      localStorage.setItem('token', res.data.data.token);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div className="bg-white rounded-2xl border border-black/[0.08] p-10 text-center max-w-md">
          <span className="text-6xl">🎉</span>
          <h2 className="text-2xl font-extrabold mt-4 mb-2">Bienvenue !</h2>
          <p className="text-[#606770] mb-6">Votre compte a été créé avec succès.</p>
          <Link href="/dashboard" className="px-6 py-3 rounded-full bg-[#1877F2] text-white font-semibold">Accéder à mon dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4 py-10" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#606770] hover:text-[#1877F2] mb-4">
            <ArrowLeft size={16} /> Retour
          </Link>
          <h1 className="text-3xl font-extrabold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></h1>
          <p className="text-[#606770] text-sm mt-2">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#fef2f2] text-[#e41e3f] text-sm text-center font-medium">{error}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#1c1e21]">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-[#606770]" />
                  <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#1c1e21]">Nom</label>
                <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#1c1e21]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#606770]" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#1c1e21]">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#606770]" />
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full pl-9 pr-10 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" required minLength={4} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-[#606770]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#1c1e21]">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-[#606770]" />
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#1c1e21]">Ville</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#606770]" />
                <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166fe0] disabled:opacity-50 transition-colors">
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-black/[0.08] text-center">
            <p className="text-sm text-[#606770]">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-[#1877F2] font-semibold hover:underline">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
