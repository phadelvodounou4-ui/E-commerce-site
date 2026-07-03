'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Menu, X, Home, ShoppingBag, PlusCircle, User, ShoppingCart, HelpCircle, Settings, Moon, Sun, Search } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/products`).then(res => {
      setProducts(res.data.data.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  var bg = darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#f0f2f5] text-[#1c1e21]';
  var navBg = darkMode ? 'bg-[#111] border-gray-800' : 'bg-white border-black/[0.08]';
  var cardBg = darkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-black/[0.08]';

  return (
    <div className={`min-h-screen ${bg}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className={`sticky top-0 z-40 ${navBg} border-b`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-black/5 rounded-lg">{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className={darkMode ? 'text-white' : 'text-[#1c1e21]'}>Direct</span></Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-black/5 rounded-lg">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <Link href="/login" className="px-3 py-1.5 rounded-full bg-[#1877F2] text-white text-sm font-semibold">Connexion</Link>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)}></div>
          <div className={`relative w-72 max-w-[85%] ${darkMode ? 'bg-[#111]' : 'bg-white'} h-full shadow-2xl p-4 space-y-1`}>
            {[{href:'/',label:'Accueil',icon:<Home size={20}/>},{href:'/products',label:'Boutique',icon:<ShoppingBag size={20}/>},{href:'/sell',label:'Vendre',icon:<PlusCircle size={20}/>},{href:'/dashboard',label:'Dashboard',icon:<User size={20}/>},{href:'/cart',label:'Panier',icon:<ShoppingCart size={20}/>},{href:'/faq',label:'FAQ',icon:<HelpCircle size={20}/>},{href:'/settings',label:'Paramètres',icon:<Settings size={20}/>}].map(item => (
              <Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${darkMode?'hover:bg-white/5':'hover:bg-[#f0f2f5]'}`}><span className="text-[#1877F2]">{item.icon}</span>{item.label}</Link>
            ))}
          </div>
        </div>
      )}

      <section className={`${darkMode?'bg-[#111]':'bg-white'} border-b border-black/[0.08]`}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">L&apos;Art du Shopping,<br/>juste à côté de chez vous.</h1>
          <p className={darkMode?'text-gray-400':'text-[#606770]'}>Achetez et vendez en toute confiance.</p>
          <div className="flex gap-3 justify-center mt-6">
            <Link href="/products" className="px-6 py-3 rounded-full bg-[#1877F2] text-white font-semibold"><Search size={16} className="inline mr-1"/>Parcourir</Link>
            <Link href="/sell" className={`px-6 py-3 rounded-full border font-semibold ${darkMode?'border-white/20':'border-black/15'}`}>Publier une annonce</Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold mb-6">🆕 Annonces récentes</h2>
        {loading ? (
          <div className="text-center py-10">Chargement...</div>
        ) : products.length === 0 ? (
          <div className={`${cardBg} rounded-2xl border p-10 text-center`}>
            <p className="text-5xl mb-4">📭</p>
            <p className={`text-lg font-semibold mb-2 ${darkMode?'text-white':'text-[#1c1e21]'}`}>Aucune annonce pour le moment</p>
            <p className={darkMode?'text-gray-400':'text-[#606770]'}>Soyez le premier à publier une annonce !</p>
            <Link href="/sell" className="inline-block mt-4 px-6 py-3 rounded-full bg-[#1877F2] text-white font-semibold">📸 Publier une annonce</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0,8).map((p:any) => (
              <Link key={p.id} href={`/products/${p.id}`} className={`${cardBg} rounded-xl border overflow-hidden hover:shadow-lg transition-shadow no-underline`}>
                {p.image ? <img src={p.image} alt={p.name} className="w-full aspect-square object-cover"/> : <div className="w-full aspect-square bg-[#f0f2f5] flex items-center justify-center text-5xl">📦</div>}
                <div className="p-3">
                  <h3 className={`font-semibold text-sm truncate ${darkMode?'text-white':'text-[#1c1e21]'}`}>{p.name}</h3>
                  <span className="text-lg font-extrabold">{p.price} FCFA</span>
                  {p.distance_km && <p className="text-xs text-[#606770] mt-1">📍 {p.distance_km} km</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className={`${darkMode?'bg-[#111]':'bg-white'} border-t border-black/[0.08] py-8 text-center text-sm ${darkMode?'text-gray-400':'text-[#606770]'}`}>
        © 2026 MarchéDirect — Tous droits réservés
      </footer>
    </div>
  );
}
