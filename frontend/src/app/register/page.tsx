'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await register(formData); window.location.href = '/'; } catch {}
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">First Name</label><div className="relative"><User className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="input-field pl-10" required /></div></div>
            <div><label className="block text-sm font-medium mb-1">Last Name</label><input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="input-field" required /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field pl-10" required /></div></div>
          <div><label className="block text-sm font-medium mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input type={show ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="input-field pl-10 pr-10" minLength={8} required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="text-center mt-6 text-sm">Already have an account? <Link href="/login" className="text-primary-600">Sign in</Link></p>
      </div>
    </div>
  );
}
