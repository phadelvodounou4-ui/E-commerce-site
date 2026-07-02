'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await login(email, password); window.location.href = '/'; } catch {}
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative"><Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" required /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative"><Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="••••••••" required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="text-center mt-6 text-sm">Don't have an account? <Link href="/register" className="text-primary-600">Sign up</Link></p>
      </div>
    </div>
  );
}
