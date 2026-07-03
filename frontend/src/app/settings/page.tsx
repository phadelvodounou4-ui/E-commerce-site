'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Bell, Shield, LogOut, Moon, Sun, Globe, Lock, Eye } from 'lucide-react';
import { t } from '@/lib/translations';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    var lang = localStorage.getItem('lang') || 'fr';
    setLanguage(lang);
    var dm = localStorage.getItem('darkMode') === 'true';
    setDarkMode(dm);
  }, []);

  var changeLanguage = function(lang: string) {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
    window.location.reload();
  };

  var toggleDarkMode = function() {
    var newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem('darkMode', String(newVal));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-[#f0f2f5] rounded-lg"><ArrowLeft size={20} /></Link>
          <h1 className="text-xl font-extrabold">⚙️ {t('settings')}</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          <h3 className="px-6 py-3 text-xs font-semibold text-[#606770] border-b uppercase tracking-wide">{t('profile')}</h3>
          <Link href="/dashboard" className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#f0f2f5]"><User size={20} className="text-[#1877F2]" /><span className="text-sm">{t('profile')}</span></Link>
          <Link href="/sell" className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#f0f2f5]"><MapPin size={20} className="text-[#1877F2]" /><span className="text-sm">{t('myAds')}</span></Link>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          <h3 className="px-6 py-3 text-xs font-semibold text-[#606770] border-b uppercase tracking-wide">{t('language')}</h3>
          <div className="flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3"><Globe size={20} className="text-[#1877F2]" /><span className="text-sm">{t('language')}</span></div>
            <select value={language} onChange={e => changeLanguage(e.target.value)} className="text-sm border border-black/10 rounded-lg px-3 py-1.5 bg-white">
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3"><Bell size={20} className="text-[#1877F2]" /><span className="text-sm">{t('notifications')}</span></div>
            <button onClick={() => setNotifications(!notifications)} className={`w-12 h-7 rounded-full transition-colors ${notifications ? 'bg-[#1877F2]' : 'bg-gray-300'} relative`}>
              <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${notifications ? 'left-[22px]' : 'left-0.5'}`}></span>
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">{darkMode ? <Moon size={20} className="text-[#1877F2]" /> : <Sun size={20} className="text-[#1877F2]" />}<span className="text-sm">{t('darkMode')}</span></div>
            <button onClick={toggleDarkMode} className={`w-12 h-7 rounded-full transition-colors ${darkMode ? 'bg-[#1877F2]' : 'bg-gray-300'} relative`}>
              <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${darkMode ? 'left-[22px]' : 'left-0.5'}`}></span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          <h3 className="px-6 py-3 text-xs font-semibold text-[#606770] border-b uppercase tracking-wide">{t('security')}</h3>
          <Link href="/privacy" className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#f0f2f5]"><Lock size={20} className="text-[#1877F2]" /><span className="text-sm">{t('privacy')}</span></Link>
          <Link href="/privacy" className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#f0f2f5]"><Eye size={20} className="text-[#1877F2]" /><span className="text-sm">{t('dataPolicy')}</span></Link>
          <Link href="/privacy" className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#f0f2f5]"><Shield size={20} className="text-[#1877F2]" /><span className="text-sm">{t('accountSecurity')}</span></Link>
          <div className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#fef2f2] transition-colors cursor-pointer">
            <LogOut size={20} className="text-[#e41e3f]" /><span className="text-sm text-[#e41e3f]">{t('logout')}</span>
          </div>
        </div>

        <p className="text-center text-xs text-[#606770] py-4">MarchéDirect v2.0 • © 2026</p>
      </div>
    </div>
  );
}
