'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, ShoppingBag, PlusCircle, User, ShoppingCart, HelpCircle, Settings, LogOut, MapPin, Moon, Sun } from 'lucide-react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const produits = [
    { id: 1, nom: 'Montre Héritage', prix: '289 000', ancienPrix: '340 000', emoji: '⌚', etoiles: 5 },
    { id: 2, nom: 'Sac Atelier Noir', prix: '154 500', ancienPrix: '189 000', emoji: '👜', etoiles: 4 },
    { id: 3, nom: 'Parfum Ombre Dorée', prix: '78 900', emoji: '🧴', etoiles: 5 },
  ];

  const bg = darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#f0f2f5] text-[#1c1e21]';
  const cardBg = darkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-black/[0.08]';
  const navBg = darkMode ? 'bg-[#111] border-gray-800' : 'bg-white border-black/[0.08]';

  return (
    <div className={`min-h-screen ${bg}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className={`sticky top-0 z-40 ${navBg} border-b`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 -ml-2 hover:bg-black/5 rounded-lg">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className={darkMode ? 'text-white' : 'text-[#1c1e21]'}>Direct</span></Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-black/5 rounded-lg">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link href={isLoggedIn ? '/dashboard' : '/login'} className="px-4 py-2 rounded-full bg-[#1877F2] text-white text-sm font-semibold">
              {isLoggedIn ? '👤' : 'Connexion'}
            </Link>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)}></div>
          <div className={`relative w-80 max-w-[85%] ${darkMode ? 'bg-[#111]' : 'bg-white'} h-full overflow-y-auto shadow-2xl`}>
            <div className="p-6 border-b border-black/[0.08]">
              <span className="text-xl font-bold text-[#1877F2]">Marché<span className={darkMode ? 'text-white' : 'text-[#1c1e21]'}>Direct</span></span>
            </div>
            <div className="p-4 space-y-1">
              {[
                { href: '/', label: 'Accueil', icon: <Home size={20} /> },
                { href: '/products', label: 'Boutique', icon: <ShoppingBag size={20} /> },
                { href: '/sell', label: 'Vendre', icon: <PlusCircle size={20} /> },
                { href: '/dashboard', label: 'Dashboard', icon: <User size={20} /> },
                { href: '/cart', label: 'Panier', icon: <ShoppingCart size={20} /> },
                { href: '/faq', label: 'FAQ', icon: <HelpCircle size={20} /> },
                { href: '/settings', label: 'Paramètres', icon: <Settings size={20} /> },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-[#f0f2f5]'}`}>
                  <span className="text-[#1877F2]">{item.icon}</span> {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className={`${darkMode ? 'bg-[#111]' : 'bg-white'} border-b border-black/[0.08]`}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e7f0ff] text-[#1877F2] text-xs font-semibold mb-4"><MapPin size={12} /> Marketplace locale</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">L&apos;Art du Shopping,<br /> juste à côté de chez vous.</h1>
            <p className={darkMode ? 'text-gray-400' : 'text-[#606770]'}>Achetez et vendez en toute confiance.</p>
            <div className="flex gap-3 mt-6">
              <Link href="/products" className="px-6 py-3 rounded-full bg-[#1877F2] text-white font-semibold">Parcourir</Link>
              <Link href="/sell" className={`px-6 py-3 rounded-full border font-semibold ${darkMode ? 'border-white/20 hover:border-[#1877F2]' : 'border-black/15 hover:border-[#1877F2]'}`}>Publier</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#e7f0ff] aspect-[4/3] flex items-center justify-center text-7xl">🛍️</div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold mb-6">Annonces populaires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {produits.map(p => (
            <div key={p.id} className={`${cardBg} rounded-xl border overflow-hidden hover:shadow-lg transition-shadow`}>
              <div className="aspect-square bg-[#f0f2f5] flex items-center justify-center text-7xl">{p.emoji}</div>
              <div className="p-4">
                <h3 className="font-semibold text-sm truncate">{p.nom}</h3>
                <span className="text-lg font-extrabold">{p.prix} FCFA</span>
                <Link href={`/products/${p.id}`} className="block w-full mt-3 py-2.5 rounded-lg bg-[#1877F2] text-white text-sm font-semibold text-center">Voir</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={`${darkMode ? 'bg-[#111]' : 'bg-white'} border-t border-black/[0.08] mt-10 py-8 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-[#606770]'}`}>
        © 2026 MarchéDirect — Tous droits réservés
      </footer>
    </div>
  );
}
