'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Bell, Shield, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('fr');

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#f0f2f5] rounded-lg"><ArrowLeft size={20} /></Link>
          <h1 className="text-xl font-extrabold">⚙️ Paramètres</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-4">
        {/* Section Profil */}
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          <h3 className="px-6 py-4 text-sm font-semibold text-[#606770] border-b border-black/[0.08]">PROFIL</h3>
          <Link href="/dashboard" className="flex items-center gap-3 px-6 py-4 hover:bg-[#f0f2f5] transition-colors">
            <User size={20} className="text-[#1877F2]" /><span className="text-sm">Modifier mon profil</span>
          </Link>
          <Link href="/sell" className="flex items-center gap-3 px-6 py-4 hover:bg-[#f0f2f5] transition-colors">
            <MapPin size={20} className="text-[#1877F2]" /><span className="text-sm">Mes annonces</span>
          </Link>
        </div>

        {/* Section Préférences */}
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          <h3 className="px-6 py-4 text-sm font-semibold text-[#606770] border-b border-black/[0.08]">PRÉFÉRENCES</h3>
          <div className="flex items-center justify-between px-6 py-4 hover:bg-[#f0f2f5]">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-[#1877F2]" /><span className="text-sm">Notifications</span>
            </div>
            <button onClick={() => setNotifications(!notifications)} className={`w-12 h-7 rounded-full transition-colors ${notifications ? 'bg-[#1877F2]' : 'bg-gray-300'} relative`}>
              <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${notifications ? 'left-[22px]' : 'left-0.5'}`}></span>
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4 hover:bg-[#f0f2f5]">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌙</span><span className="text-sm">Mode sombre</span>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full transition-colors ${darkMode ? 'bg-[#1877F2]' : 'bg-gray-300'} relative`}>
              <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${darkMode ? 'left-[22px]' : 'left-0.5'}`}></span>
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌐</span><span className="text-sm">Langue</span>
            </div>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="text-sm border border-black/10 rounded-lg px-3 py-1.5">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Section Sécurité */}
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          <h3 className="px-6 py-4 text-sm font-semibold text-[#606770] border-b border-black/[0.08]">SÉCURITÉ</h3>
          <div className="flex items-center gap-3 px-6 py-4 hover:bg-[#f0f2f5] transition-colors cursor-pointer">
            <Shield size={20} className="text-[#1877F2]" /><span className="text-sm">Confidentialité</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 hover:bg-[#fef2f2] transition-colors cursor-pointer">
            <LogOut size={20} className="text-[#e41e3f]" /><span className="text-sm text-[#e41e3f]">Déconnexion</span>
          </div>
        </div>

        <p className="text-center text-xs text-[#606770] py-4">MarchéDirect v1.0 • © 2026</p>
      </div>
    </div>
  );
}
