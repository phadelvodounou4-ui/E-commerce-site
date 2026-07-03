'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const produits: any = {
  '1': { id: 1, nom: 'Montre Héritage', prix: '289 000', ancienPrix: '340 000', emoji: '⌚', etoiles: 5, avis: 128, description: 'Montre de luxe avec bracelet en cuir véritable. Mouvement automatique suisse.' },
  '2': { id: 2, nom: 'Sac Atelier Noir', prix: '154 500', ancienPrix: '189 000', emoji: '👜', etoiles: 4, avis: 76, description: 'Sac en cuir pleine fleur fabriqué à la main. Finitions dorées.' },
  '3': { id: 3, nom: 'Parfum Ombre Dorée', prix: '78 900', emoji: '🧴', etoiles: 5, avis: 214, description: 'Eau de parfum aux notes boisées et ambrées. Flacon en verre taillé.' },
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const p = produits[id];

  if (!p) return <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center"><p>Produit non trouvé</p></div>;

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <Link href="/products" className="text-sm font-semibold text-[#1877F2] hover:underline">← Retour</Link>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-white border border-black/[0.08] aspect-square flex items-center justify-center text-9xl">{p.emoji}</div>
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#e7f0ff] text-[#1877F2] text-xs font-semibold mb-4">En stock</span>
          <h1 className="text-3xl font-extrabold mb-4">{p.nom}</h1>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 20 20" className={`w-4 h-4 ${i < p.etoiles ? 'fill-[#f5a623]' : 'fill-black/10'}`}><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" /></svg>
            ))}
            <span className="text-sm text-[#606770] ml-1">({p.avis} avis)</span>
          </div>
          <p className="text-[#606770] mb-6">{p.description}</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-extrabold">{p.prix} FCFA</span>
            {p.ancienPrix && <span className="text-lg text-[#606770] line-through">{p.ancienPrix} FCFA</span>}
          </div>
          <button className="w-full py-3 rounded-lg bg-[#1877F2] text-white font-semibold hover:bg-[#166fe0] transition-colors">Ajouter au panier</button>
        </div>
      </div>
    </div>
  );
}
