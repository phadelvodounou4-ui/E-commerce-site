import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import toast from 'react-hot-toast';

interface CartItem { id: string; quantity: number; product: { id: string; name: string; price: number; images: string[]; stockQuantity: number; }; }
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const fetchCart = async () => {
    try { const res = await apiClient.get('/cart'); setItems(res.data.data.items); } catch {}
  };
  const addToCart = async (productId: string, quantity = 1) => {
    await apiClient.post('/cart', { productId, quantity });
    await fetchCart();
    toast.success('Added to cart!');
  };
  const updateQuantity = async (itemId: string, quantity: number) => {
    await apiClient.patch(`/cart/${itemId}`, { quantity });
    await fetchCart();
  };
  const removeItem = async (itemId: string) => {
    await apiClient.delete(`/cart/${itemId}`);
    await fetchCart();
  };
  const clearCart = async () => {
    await apiClient.delete('/cart');
    setItems([]);
  };
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
  useEffect(() => { if (localStorage.getItem('token')) fetchCart(); }, []);
  return { items, totalItems, totalPrice, addToCart, updateQuantity, removeItem, clearCart, fetchCart };
}
