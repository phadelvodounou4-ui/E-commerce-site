import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface User { id: string; email: string; firstName: string; lastName: string; role: string; }
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) apiClient.get('/auth/me').then(res => { setUser(res.data.data.user); }).catch(() => { localStorage.removeItem('token'); }).finally(() => setLoading(false));
    else setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
    setUser(res.data.data.user);
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const res = await apiClient.post('/auth/register', data);
    localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
    setUser(res.data.data.user);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return { user, loading, login, register, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin' };
}
