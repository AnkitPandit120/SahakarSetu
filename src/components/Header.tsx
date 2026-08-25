import React from 'react';
import { Landmark, Globe, User, Shield } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentTab: 'home' | 'guided' | 'chat' | 'services' | 'schemes' | 'about';
  setCurrentTab: (tab: 'home' | 'guided' | 'chat' | 'services' | 'schemes' | 'about') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile | null;
  openAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  user,
  openAuthModal
}) => {
  const t = TRANSLATIONS[language];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' }
  ];

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top public service banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-8 py-1.5 flex justify-between items-center tracking-wide">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-medium text-slate-100">Public Service Legal & Cooperative Information Portal</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-300 text-xs font-mono">
          <span>Kisan Helpline: <strong>1800-180-1551</strong></span>
          <span>•</span>
          <span>PMFBY: <strong>14447</strong></span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & title */}
          <div
            id="brand-logo-btn"
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:bg-slate-700 transition-colors">
              <Landmark className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-800">
                {t.appName}
              </span>
              <span className="hidden lg:inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Official Guide
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              id="nav-home-btn"
              onClick={() => setCurrentTab('home')}
              className={`text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.navHome}
            </button>
            <button
              id="nav-services-btn"
              onClick={() => setCurrentTab('services')}
              className={`text-sm font-medium transition-colors ${
                currentTab === 'services'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.navServices}
            </button>
            <button
              id="nav-schemes-btn"
              onClick={() => setCurrentTab('schemes')}
              className={`text-sm font-medium transition-colors ${
                currentTab === 'schemes'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.navSchemes}
            </button>
            <button
              id="nav-about-btn"
              onClick={() => setCurrentTab('about')}
              className={`text-sm font-medium transition-colors ${
                currentTab === 'about'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.navAbout}
            </button>
          </nav>

          {/* Right actions: Language Selector & User Login */}
          <div className="flex items-center gap-3">
            {/* Language Selector pills */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 text-[11px] font-semibold border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-400 mx-1 hidden sm:inline-block" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  id={`lang-select-${lang.code}`}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded cursor-pointer transition-all ${
                    language === lang.code
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title={lang.label}
                >
                  {lang.native}
                </button>
              ))}
            </div>

            {/* User Account / Login Button */}
            <button
              id="auth-header-btn"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-slate-300" />
              <span>
                {user ? user.name.split(' ')[0] : t.navLogin}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden border-t border-slate-200 bg-white px-4 py-2 flex justify-around text-xs">
        <button
          onClick={() => setCurrentTab('home')}
          className={`py-1 px-3 rounded-md font-medium transition-colors ${
            currentTab === 'home' ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.navHome}
        </button>
        <button
          onClick={() => setCurrentTab('services')}
          className={`py-1 px-3 rounded-md font-medium transition-colors ${
            currentTab === 'services' ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.navServices}
        </button>
        <button
          onClick={() => setCurrentTab('schemes')}
          className={`py-1 px-3 rounded-md font-medium transition-colors ${
            currentTab === 'schemes' ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.navSchemes}
        </button>
        <button
          onClick={() => setCurrentTab('about')}
          className={`py-1 px-3 rounded-md font-medium transition-colors ${
            currentTab === 'about' ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.navAbout}
        </button>
      </div>
    </header>
  );
};
