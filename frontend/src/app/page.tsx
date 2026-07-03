'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, ShoppingBag, PlusCircle, User, ShoppingCart, HelpCircle, Settings, LogOut, MapPin } from 'lucide-react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const produits = [
    { id: 1, nom: 'Montre Héritage', categorie: 'Horlogerie', prix: '289 000', ancienPrix: '340 000', emoji: '⌚', etoiles: 5, avis: 128 },
    { id: 2, nom: 'Sac Atelier Noir', categorie: 'Maroquinerie', prix: '154 500', ancienPrix: '189 000', emoji: '👜', etoiles: 4, avis: 76 },
    { id: 3, nom: 'Parfum Ombre Dorée', categorie: 'Parfumerie', prix: '78 900', emoji: '🧴', etoiles: 5, avis: 214 },
  ];

  const menuItems = [
    { href: '/', label: 'Accueil', icon: <Home size={20} /> },
    { href: '/products', label: 'Boutique', icon: <ShoppingBag size={20} /> },
    { href: '/sell', label: 'Vendre', icon: <PlusCircle size={20} /> },
    { href: '/dashboard', label: 'Dashboard', icon: <User size={20} /> },
    { href: '/cart', label: 'Panier', icon: <ShoppingCart size={20} /> },
    { href: '/faq', label: 'FAQ', icon: <HelpCircle size={20} /> },
    { href: '/settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#1c1e21]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Menu hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 -ml-2 hover:bg-[#f0f2f5] rounded-lg">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#606770]">
            <Link href="/products" className="hover:text-[#1877F2] flex items-center gap-1"><ShoppingBag size={16} /> Boutique</Link>
            <Link href="/sell" className="hover:text-[#1877F2] flex items-center gap-1"><PlusCircle size={16} /> Vendre</Link>
          </div>
          
          <Link href={isLoggedIn ? '/dashboard' : '/login'} className="px-4 py-2 rounded-full bg-[#1877F2] text-white text-sm font-semibold">
            {isLoggedIn ? '👤 Compte' : 'Connexion'}
          </Link>
        </div>
      </nav>

      {/* MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)}></div>
          <div className="relative w-80 max-w-[85%] bg-white h-full overflow-y-auto shadow-2xl animate-slide-in">
            <div className="p-6 border-b border-black/[0.08]">
              <span className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></span>
              <p className="text-xs text-[#606770] mt-1">📍 Votre marketplace locale</p>
            </div>
            <div className="p-4 space-y-1">
              {menuItems.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f0f2f5] text-sm font-medium text-[#1c1e21] transition-colors">
                  <span className="text-[#1877F2]">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-black/[0.08] p-4">
              {isLoggedIn ? (
                <button onClick={() => { setIsLoggedIn(false); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#fef2f2] text-sm font-medium text-[#e41e3f] w-full">
                  <LogOut size={20} /> Déconnexion
                </button>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e7f0ff] text-sm font-medium text-[#1877F2]">
                  <User size={20} /> Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e7f0ff] text-[#1877F2] text-xs font-semibold mb-4">
              <MapPin size={12} /> Nouveau sur la marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">L&apos;Art du Shopping,<br /> juste à côté de chez vous.</h1>
            <p className="text-[#606770] text-base mb-8 max-w-md">Achetez et vendez en toute confiance. Des milliers d&apos;annonces vérifiées, une communauté locale active.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="px-6 py-3 rounded-full bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#166fe0]">Parcourir les annonces</Link>
              <Link href="/sell" className="px-6 py-3 rounded-full bg-white border border-black/15 text-sm font-semibold hover:border-[#1877F2] hover:text-[#1877F2]">Publier une annonce</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#e7f0ff] aspect-[4/3] flex items-center justify-center text-7xl">🛍️</div>
        </div>
      </section>

      {/* PRODUITS */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-extrabold">Annonces populaires</h2>
          <Link href="/products" className="text-sm font-semibold text-[#1877F2] hover:underline">Voir tout</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {produits.map((p) => (
            <div key={p.id} className="group bg-white rounded-xl border border-black/[0.08] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square bg-[#f0f2f5] flex items-center justify-center">
                <span className="text-7xl transition-transform group-hover:scale-105">{p.emoji}</span>
                {p.ancienPrix && <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#e41e3f] text-white text-[11px] font-bold">PROMO</span>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 truncate">{p.nom}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-extrabold">{p.prix} FCFA</span>
                  {p.ancienPrix && <span className="text-xs text-[#606770] line-through">{p.ancienPrix} FCFA</span>}
                </div>
                <Link href={`/products/${p.id}`} className="block w-full py-2.5 rounded-lg bg-[#1877F2] text-white text-sm font-semibold text-center hover:bg-[#166fe0]">Voir</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-black/[0.08] mt-10">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div><span className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></span><p className="text-sm text-[#606770] mt-3">La marketplace locale.</p></div>
          <div><h4 className="text-sm font-semibold mb-3">Boutique</h4><ul className="space-y-2 text-sm text-[#606770]"><li><Link href="/products" className="hover:text-[#1877F2]">Annonces</Link></li><li><Link href="/sell" className="hover:text-[#1877F2]">Vendre</Link></li></ul></div>
          <div><h4 className="text-sm font-semibold mb-3">Compte</h4><ul className="space-y-2 text-sm text-[#606770]"><li><Link href="/dashboard" className="hover:text-[#1877F2]">Dashboard</Link></li><li><Link href="/settings" className="hover:text-[#1877F2]">Paramètres</Link></li></ul></div>
          <div><h4 className="text-sm font-semibold mb-3">Aide</h4><ul className="space-y-2 text-sm text-[#606770]"><li><Link href="/faq" className="hover:text-[#1877F2]">FAQ</Link></li><li><Link href="/cart" className="hover:text-[#1877F2]">Panier</Link></li></ul></div>
        </div>
        <div className="border-t border-black/[0.08] py-5"><p className="text-center text-xs text-[#606770]">© 2026 MarchéDirect — Tous droits réservés</p></div>
      </footer>
    </div>
  );
}
