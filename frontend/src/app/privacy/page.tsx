import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/settings" className="p-2 hover:bg-[#f0f2f5] rounded-lg"><ArrowLeft size={20} /></Link>
          <h1 className="text-xl font-extrabold flex items-center gap-2"><Shield size={22} className="text-[#1877F2]" /> Confidentialité</h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-white rounded-2xl border border-black/[0.08] p-6">
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><FileText size={20} className="text-[#1877F2]" /> Politique de confidentialité</h2>
          <p className="text-[#606770] text-sm leading-relaxed mb-4">Dernière mise à jour : 3 juillet 2026</p>
          
          <div className="space-y-4 text-sm text-[#606770] leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1c1e21] mb-1">1. Collecte des données</h3>
              <p>Nous collectons votre nom, email, numéro de téléphone et localisation lors de l&apos;inscription. Les photos de produits sont stockées sur Cloudinary.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1c1e21] mb-1">2. Utilisation des données</h3>
              <p>Vos données sont utilisées pour faciliter les transactions entre acheteurs et vendeurs, et pour améliorer votre expérience sur la plateforme.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1c1e21] mb-1">3. Protection</h3>
              <p>Vos mots de passe sont chiffrés avec bcrypt. Les communications sont sécurisées via HTTPS. Nous ne partageons jamais vos données avec des tiers.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1c1e21] mb-1">4. Vos droits</h3>
              <p>Vous pouvez à tout moment modifier ou supprimer vos informations depuis votre dashboard. Contactez-nous pour toute demande.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1c1e21] mb-1">5. Cookies</h3>
              <p>Nous utilisons uniquement des cookies essentiels au fonctionnement du site (connexion, panier). Aucun cookie publicitaire.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.08] p-6">
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><Lock size={20} className="text-[#1877F2]" /> Sécurité</h2>
          <ul className="space-y-3 text-sm text-[#606770]">
            <li className="flex items-start gap-2">🔒 Mots de passe chiffrés avec bcrypt</li>
            <li className="flex items-start gap-2">🎫 Authentification par token JWT sécurisé</li>
            <li className="flex items-start gap-2">🔗 Toutes les communications en HTTPS</li>
            <li className="flex items-start gap-2">☁️ Photos stockées sur Cloudinary (serveurs sécurisés)</li>
            <li className="flex items-start gap-2">🗄️ Base de données PostgreSQL sur Render</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.08] p-6">
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><Eye size={20} className="text-[#1877F2]" /> Transparence</h2>
          <p className="text-[#606770] text-sm leading-relaxed">
            MarchéDirect est une marketplace locale développée pour connecter acheteurs et vendeurs. 
            Nous ne vendons pas vos données. Nous ne faisons pas de publicité ciblée. 
            Votre confiance est notre priorité.
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-[#606770]">
            Pour toute question : contact@marchedirect.com<br />
            MarchéDirect © 2026 — Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
}
