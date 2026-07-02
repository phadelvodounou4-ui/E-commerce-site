'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, User, LogOut, Heart, MessageSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600">ShopHub</Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-gray-700 hover:text-primary-600">Products</Link>
          {isAuthenticated ? (
            <>
              <Link href="/wishlist"><Heart className="h-6 w-6" /></Link>
              <Link href="/messages"><MessageSquare className="h-6 w-6" /></Link>
              <Link href="/cart" className="relative"><ShoppingCart className="h-6 w-6" />{totalItems > 0 && <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>}</Link>
              <div className="relative group">
                <button className="flex items-center gap-2"><User className="h-6 w-6" />{user?.firstName}</button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-50">Dashboard</Link>
                  {isAdmin && <Link href="/admin" className="block px-4 py-2 hover:bg-gray-50 text-primary-600">Admin</Link>}
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-primary-600">Sign In</Link>
              <Link href="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">{mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </div>
      {mobileOpen && (
        <div className="md:hidden px-4 py-4 space-y-3 bg-white border-t">
          <Link href="/products" className="block">Products</Link>
          {isAuthenticated && <Link href="/cart" className="block">Cart ({totalItems})</Link>}
          {isAuthenticated && <Link href="/wishlist" className="block">Wishlist</Link>}
          {isAuthenticated && <Link href="/messages" className="block">Messages</Link>}
          {isAuthenticated && <Link href="/dashboard" className="block">Dashboard</Link>}
          {isAdmin && <Link href="/admin" className="block text-primary-600">Admin</Link>}
          {isAuthenticated ? <button onClick={logout} className="block text-red-600">Logout</button> : <Link href="/login" className="block">Sign In</Link>}
        </div>
      )}
    </nav>
  );
}
