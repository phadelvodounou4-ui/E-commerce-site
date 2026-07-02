import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface Product { id: string; name: string; slug: string; price: number; images: string[]; ratingAvg: number; ratingCount: number; category?: { name: string }; seller?: { firstName: string; lastName: string }; }
interface Filters { search?: string; category?: string; minPrice?: number; maxPrice?: number; sort?: string; page?: number; }

export function useProducts(initialFilters: Filters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.append(k, String(v)); });
    const res = await apiClient.get(`/products?${params.toString()}`);
    setProducts(res.data.data.products);
    setPagination(res.data.data.pagination);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [filters]);
  return { products, loading, pagination, filters, updateFilters: (f: Partial<Filters>) => setFilters(prev => ({ ...prev, ...f, page: 1 })) };
}
