import Link from 'next/link';

export default function HomePage() {
  const produits = [
    { id: 1, nom: 'Montre Héritage', categorie: 'Horlogerie', prix: '289 000', ancienPrix: '340 000', emoji: '⌚', etoiles: 5, avis: 128 },
    { id: 2, nom: 'Sac Atelier Noir', categorie: 'Maroquinerie', prix: '154 500', ancienPrix: '189 000', emoji: '👜', etoiles: 4, avis: 76 },
    { id: 3, nom: 'Parfum Ombre Dorée', categorie: 'Parfumerie', prix: '78 900', ancienPrix: null, emoji: '🧴', etoiles: 5, avis: 214 },
  ];

  const avantages = [
    { titre: 'Livraison rapide', texte: 'Remise en main propre sous 48h, partout à Cotonou et alentours.', icone: '🚚' },
    { titre: 'Paiement sécurisé', texte: 'Transactions chiffrées, sans compromis sur votre confidentialité.', icone: '🔒' },
    { titre: 'Qualité vérifiée', texte: 'Chaque annonce est contrôlée avant mise en ligne.', icone: '✅' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#1c1e21]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#606770]">
            <Link href="/products" className="hover:text-[#1877F2] transition-colors">Boutique</Link>
            <Link href="/cart" className="hover:text-[#1877F2] transition-colors">Panier</Link>
            <Link href="/admin" className="hover:text-[#1877F2] transition-colors">Admin</Link>
          </div>
          <Link href="/login" className="px-4 py-2 rounded-full bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#166fe0] transition-colors">
            Mon compte
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#e7f0ff] text-[#1877F2] text-xs font-semibold mb-4">
              Nouveau sur la marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              L&apos;Art du Shopping,<br className="hidden md:block" /> juste à côté de chez vous.
            </h1>
            <p className="text-[#606770] text-base mb-8 max-w-md">
              Achetez et vendez en toute confiance. Des milliers d&apos;annonces vérifiées, une communauté locale active.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="px-6 py-3 rounded-full bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#166fe0] transition-colors">
                Parcourir les annonces
              </Link>
              <Link href="/register" className="px-6 py-3 rounded-full bg-white border border-black/15 text-sm font-semibold hover:border-[#1877F2] hover:text-[#1877F2] transition-colors">
                S&apos;inscrire
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#e7f0ff] aspect-[4/3] flex items-center justify-center text-7xl">
            🛍️
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {avantages.map((a) => (
          <div key={a.titre} className="flex items-start gap-4 bg-white rounded-xl border border-black/[0.08] p-5 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 shrink-0 rounded-full bg-[#e7f0ff] text-[#1877F2] flex items-center justify-center text-xl">
              {a.icone}
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{a.titre}</h3>
              <p className="text-xs text-[#606770] leading-relaxed">{a.texte}</p>
            </div>
          </div>
        ))}
      </section>

      {/* PRODUITS */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-extrabold">Annonces populaires</h2>
          <Link href="/products" className="text-sm font-semibold text-[#1877F2] hover:underline">Voir tout</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {produits.map((p) => (
            <div key={p.id} className="group bg-white rounded-xl border border-black/[0.08] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square bg-[#f0f2f5] flex items-center justify-center">
                <span className="text-7xl transition-transform duration-300 group-hover:scale-105">{p.emoji}</span>
                {p.ancienPrix && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#e41e3f] text-white text-[11px] font-bold">PROMO</span>
                )}
                <span className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/90 text-[#606770] text-[10px] font-semibold">{p.categorie}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 truncate">{p.nom}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className={`w-3 h-3 ${i < p.etoiles ? 'fill-[#f5a623]' : 'fill-black/10'}`}>
                      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
                    </svg>
                  ))}
                  <span className="text-[11px] text-[#606770] ml-1">({p.avis})</span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-extrabold text-[#1c1e21]">{p.prix} FCFA</span>
                  {p.ancienPrix && <span className="text-xs text-[#606770] line-through">{p.ancienPrix} FCFA</span>}
                </div>
                <button className="w-full py-2.5 rounded-lg bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#166fe0] transition-colors">
                  Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-black/[0.08] mt-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></span>
            <p className="text-sm text-[#606770] mt-3 max-w-xs">La marketplace locale qui connecte acheteurs et vendeurs en toute simplicité.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Boutique</h4>
            <ul className="space-y-2 text-sm text-[#606770]">
              <li><Link href="/products" className="hover:text-[#1877F2] transition-colors">Toutes les annonces</Link></li>
              <li><Link href="/cart" className="hover:text-[#1877F2] transition-colors">Panier</Link></li>
              <li><Link href="/admin" className="hover:text-[#1877F2] transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Assistance</h4>
            <ul className="space-y-2 text-sm text-[#606770]">
              <li><Link href="/login" className="hover:text-[#1877F2] transition-colors">Connexion</Link></li>
              <li><Link href="/register" className="hover:text-[#1877F2] transition-colors">Inscription</Link></li>
              <li><Link href="/products" className="hover:text-[#1877F2] transition-colors">Produits</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black/[0.08] py-5">
          <p className="text-center text-xs text-[#606770]">© 2026 MarchéDirect — Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
