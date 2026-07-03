'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      localStorage.setItem('token', res.data.data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants incorrects');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#606770] hover:text-[#1877F2] mb-6"><ArrowLeft size={16} /> Retour</Link>
          <h1 className="text-3xl font-extrabold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></h1>
          <p className="text-[#606770] text-sm mt-2">Connectez-vous à votre compte</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-6">
          {error && <div className="mb-4 p-3 rounded-xl bg-[#fef2f2] text-[#e41e3f] text-sm text-center font-medium">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-3.5 h-5 w-5 text-[#606770]" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" required /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Mot de passe</label>
              <div className="relative"><Lock className="absolute left-3 top-3.5 h-5 w-5 text-[#606770]" /><input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3.5">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166fe0] disabled:opacity-50">{loading ? 'Connexion...' : 'Se connecter'}</button>
          </form>
          <div className="mt-5 pt-5 border-t border-black/[0.08] text-center"><p className="text-sm text-[#606770]">Pas encore de compte ? <Link href="/register" className="text-[#1877F2] font-semibold hover:underline">S&apos;inscrire</Link></p></div>
        </div>
      </div>
    </div>
  );
}
