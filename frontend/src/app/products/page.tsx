'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Search, Filter, MapPin, X, ChevronDown } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      const res = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(res.data.data.products);
    } catch (err) {}
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <Link href="/sell" className="px-4 py-2 rounded-full bg-[#1877F2] text-white text-sm font-semibold">+ Vendre</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#606770]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-2xl text-sm focus:outline-none focus:border-[#1877F2] shadow-sm"
          />
        </form>

        {/* Barre filtres */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${showFilters ? 'bg-[#1877F2] text-white' : 'bg-white border border-black/10 text-[#606770]'}`}>
            <Filter size={16} /> Filtres
          </button>
          {(search || category || location) && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-[#e41e3f] font-medium hover:bg-[#fef2f2] rounded-lg">
              <X size={14} /> Effacer
            </button>
          )}
          <span className="text-sm text-[#606770] ml-auto">{products.length} résultat{products.length > 1 ? 's' : ''}</span>
        </div>

        {/* Filtres */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-black/[0.08] p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#606770]">Catégorie</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2] bg-white">
                <option value="">Toutes</option>
                <option value="Électronique">Électronique</option>
                <option value="Mode">Mode</option>
                <option value="Maison">Maison</option>
                <option value="Véhicules">Véhicules</option>
                <option value="Autres">Autres</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#606770] flex items-center gap-1"><MapPin size={12} /> Localisation</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ville, quartier..."
                className="w-full px-4 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]" />
            </div>
            <div className="sm:col-span-2">
              <button onClick={fetchProducts}
                className="w-full py-2.5 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166fe0] transition-colors">
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}

        {/* Résultats */}
        {loading ? (
          <div className="text-center py-20 text-[#606770]">Chargement...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-[#ccc] mb-4" />
            <p className="text-[#606770] text-lg font-medium">Aucun produit trouvé</p>
            <p className="text-[#606770] text-sm mt-1">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`}
                className="group bg-white rounded-xl border border-black/[0.08] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 no-underline">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-[#f0f2f5] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">📦</div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 text-[#1c1e21] line-clamp-2">{p.name}</h3>
                  {p.location && (
                    <p className="text-xs text-[#606770] mb-2 flex items-center gap-1">
                      <MapPin size={10} /> {p.location}
                    </p>
                  )}
                  <p className="text-xs text-[#606770] mb-2">{p.category || 'Non catégorisé'}</p>
                  <span className="text-lg font-extrabold text-[#1c1e21]">{p.price} FCFA</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
