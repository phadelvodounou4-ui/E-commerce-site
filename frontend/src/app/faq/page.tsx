import Link from 'next/link';

const faqs = [
  { q: 'Comment publier une annonce ?', a: 'Cliquez sur "Vendre" dans le menu, remplissez le formulaire, ajoutez une photo, et publiez.' },
  { q: 'La publication est-elle gratuite ?', a: 'Oui, la publication d\'annonces est totalement gratuite sur MarchéDirect.' },
  { q: 'Comment contacter un vendeur ?', a: 'Pour l\'instant, contactez le vendeur via les informations fournies dans l\'annonce.' },
  { q: 'Comment sont livrés les produits ?', a: 'La livraison se fait en main propre. Convenez d\'un lieu avec le vendeur.' },
  { q: 'Que faire en cas de problème ?', a: 'Contactez-nous via l\'email dans le pied de page. Nous vous assisterons.' },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1877F2]">Marché<span className="text-[#1c1e21]">Direct</span></Link>
          <Link href="/" className="text-sm font-semibold text-[#1877F2] hover:underline">← Accueil</Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold mb-6">❓ Questions fréquentes</h1>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white rounded-xl border border-black/[0.08] p-5 cursor-pointer group">
              <summary className="font-semibold text-sm list-none flex justify-between items-center">
                {faq.q}
                <span className="text-[#1877F2] group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <p className="text-[#606770] text-sm mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
