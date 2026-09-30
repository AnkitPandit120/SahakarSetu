import React, { useState } from 'react';
import {
  Globe,
  User,
  Shield,
  Search,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Volume2,
  Eye,
  FileText,
  Mic,
  Sparkles,
  Radio,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentTab: 'home' | 'guided' | 'chat' | 'services' | 'schemes' | 'faq' | 'about' | 'admin';
  setCurrentTab: (tab: 'home' | 'guided' | 'chat' | 'services' | 'schemes' | 'faq' | 'about' | 'admin') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile | null;
  openAuthModal: () => void;
  onOpenVoiceMode?: () => void;
  onOpenSpeechToSpeech?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  user,
  openAuthModal,
  onOpenSpeechToSpeech
}) => {
  const t = TRANSLATIONS[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'larger'>('normal');

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' }
  ];

  const handleFontSize = (level: 'normal' | 'large' | 'larger') => {
    setFontSizeLevel(level);
    if (level === 'large') {
      document.documentElement.style.fontSize = '17px';
    } else if (level === 'larger') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white shadow-xs">
      {/* 1. Indian National Tricolor Top Line */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" title="Saffron"></div>
        <div className="flex-1 bg-white" title="White"></div>
        <div className="flex-1 bg-[#138808]" title="Green"></div>
      </div>

      {/* 2. Official Government Top Accessibility & Utility Strip */}
      <div className="bg-[#f0f4f8] border-b border-slate-200 text-[11px] sm:text-xs text-slate-700 px-3 sm:px-8 py-1">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Ministry Identification */}
          <div className="flex items-center gap-2 text-slate-800">
            <span className="font-semibold text-slate-900">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span className="font-medium text-slate-700">GOVERNMENT OF INDIA</span>
            <span className="hidden md:inline-block text-slate-400">•</span>
            <span className="hidden md:inline-block font-semibold text-[#0B3B60]">
              सहकारिता मंत्रालय (MINISTRY OF COOPERATION)
            </span>
          </div>

          {/* Right: Accessibility Controls & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Skip to main content */}
            <a
              href="#main-content"
              className="hidden lg:inline-block text-slate-600 hover:text-[#0B3B60] font-medium transition-colors"
            >
              Skip to Main Content
            </a>

            {/* Font Resizing Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => handleFontSize('normal')}
                className={`px-1 rounded hover:bg-slate-100 ${fontSizeLevel === 'normal' ? 'font-bold text-[#0B3B60]' : 'text-slate-600'}`}
                title="Default Font Size"
              >
                A
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => handleFontSize('large')}
                className={`px-1 rounded hover:bg-slate-100 ${fontSizeLevel === 'large' ? 'font-bold text-[#0B3B60]' : 'text-slate-600'}`}
                title="Large Font Size"
              >
                A+
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => handleFontSize('larger')}
                className={`px-1 rounded hover:bg-slate-100 ${fontSizeLevel === 'larger' ? 'font-bold text-[#0B3B60]' : 'text-slate-600'}`}
                title="Extra Large Font Size"
              >
                A++
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-white rounded border border-slate-300 p-0.5">
              <Globe className="w-3 h-3 text-[#0B3B60] ml-1 mr-0.5 hidden sm:inline-block" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  id={`lang-select-${lang.code}`}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    language === lang.code
                      ? 'bg-[#0B3B60] text-white font-semibold'
                      : 'text-slate-700 hover:text-black hover:bg-slate-100'
                  }`}
                  title={lang.label}
                >
                  {lang.native}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. National Identity Banner: Ashoka Lion Emblem + Bilingual Department Title */}
      <div className="bg-white border-b border-slate-200 py-3 sm:py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Official Emblem + Title */}
          <div
            id="brand-logo-btn"
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group select-none"
          >
            {/* Ashoka Lion Capital Vector Motif */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center p-1 shadow-xs">
                {/* State Emblem Graphic Representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-900 fill-current" aria-label="Emblem of India">
                  <path d="M50 8 C40 8 32 14 32 24 C32 30 36 35 40 38 L40 46 C34 46 28 50 28 58 L28 72 C28 76 32 80 36 80 L64 80 C68 80 72 76 72 72 L72 58 C72 50 66 46 60 46 L60 38 C64 35 68 30 68 24 C68 14 60 8 50 8 Z M50 14 C56 14 62 18 62 24 C62 28 59 32 55 33 L55 38 L45 38 L45 33 C41 32 38 28 38 24 C38 18 44 14 50 14 Z M35 56 C35 52 38 50 42 50 L58 50 C62 50 65 52 65 56 L65 74 L35 74 Z" />
                  <circle cx="50" cy="62" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="25" y="84" width="50" height="6" rx="2" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[8px] font-extrabold text-amber-950 tracking-tighter mt-0.5">सत्यमेव जयते</span>
            </div>

            {/* Department & Portal Title */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0B3B60] leading-none">
                  सहकार सेतु
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-800 tracking-wide uppercase">
                  | SAHAKAR SETU
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-0.5 tracking-tight leading-tight">
                राष्ट्रीय सहकारिता एवं विधिक सहायता पोर्टल (National Cooperative Governance Portal)
              </p>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                सहकारिता मंत्रालय, भारत सरकार • Ministry of Cooperation, Government of India
              </p>
            </div>
          </div>

          {/* Right: National Initiatives Badges & Official Citizen Auth */}
          <div className="flex items-center gap-3">
            {/* Azadi Ka Amrit Mahotsav / 75 Years Badge motif */}
            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200 select-none">
              <div className="flex flex-col items-center text-center bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                <span className="text-[10px] font-black text-[#FF9933] uppercase leading-tight">सहकार से समृद्धि</span>
                <span className="text-[8px] font-bold text-slate-600 tracking-tighter">Prosperity through Cooperation</span>
              </div>

              <div className="flex flex-col items-center text-center bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                <span className="text-[10px] font-black text-[#138808] uppercase leading-tight">Digital India</span>
                <span className="text-[8px] font-bold text-slate-600 tracking-tighter">Power To Empower</span>
              </div>
            </div>

            {/* Official Citizen Login */}
            <button
              id="auth-header-btn"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#0B3B60] hover:bg-[#07253d] text-white rounded-md transition-colors shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>{user ? user.name.split(' ')[0] : (language === 'hi' ? 'नागरिक लॉगिन' : 'Citizen Login')}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 border border-slate-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Official Department Blue Navigation Bar */}
      <div className="bg-[#0B3B60] text-white border-b-2 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto text-xs font-semibold py-0">
            <button
              id="nav-home-btn"
              onClick={() => setCurrentTab('home')}
              className={`px-4 py-3 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'home'
                  ? 'bg-[#06243c] text-amber-300 border-b-4 border-amber-400 font-bold'
                  : 'text-slate-100 hover:bg-[#082e4b] hover:text-white'
              }`}
            >
              <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
            </button>

            <button
              id="nav-chat-btn"
              onClick={() => setCurrentTab('chat')}
              className={`px-4 py-3 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'chat'
                  ? 'bg-[#06243c] text-amber-300 border-b-4 border-amber-400 font-bold'
                  : 'text-slate-100 hover:bg-[#082e4b] hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{language === 'hi' ? 'एआई सहकार मित्र (AI Sahayak)' : 'AI Sahayak (Chat)'}</span>
            </button>

            <button
              id="nav-services-btn"
              onClick={() => setCurrentTab('services')}
              className={`px-4 py-3 transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'services'
                  ? 'bg-[#06243c] text-amber-300 border-b-4 border-amber-400 font-bold'
                  : 'text-slate-100 hover:bg-[#082e4b] hover:text-white'
              }`}
            >
              <span>{language === 'hi' ? 'नागरिक व पैक्स सेवाएं' : 'Citizen & PACS Services'}</span>
            </button>

            <button
              id="nav-schemes-btn"
              onClick={() => setCurrentTab('schemes')}
              className={`px-4 py-3 transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'schemes'
                  ? 'bg-[#06243c] text-amber-300 border-b-4 border-amber-400 font-bold'
                  : 'text-slate-100 hover:bg-[#082e4b] hover:text-white'
              }`}
            >
              <span>{language === 'hi' ? 'सरकारी योजनाएं' : 'Central Schemes'}</span>
            </button>

            <button
              id="nav-guided-btn"
              onClick={() => setCurrentTab('guided')}
              className={`px-4 py-3 transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'guided'
                  ? 'bg-[#06243c] text-amber-300 border-b-4 border-amber-400 font-bold'
                  : 'text-slate-100 hover:bg-[#082e4b] hover:text-white'
              }`}
            >
              <span>{language === 'hi' ? 'विधिक अधिनियम व नियम' : 'Acts & Bye-Laws Navigator'}</span>
            </button>

            <button
              id="nav-faq-btn"
              onClick={() => setCurrentTab('faq')}
              className={`px-4 py-3 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'faq'
                  ? 'bg-[#06243c] text-amber-300 border-b-4 border-amber-400 font-bold'
                  : 'text-slate-100 hover:bg-[#082e4b] hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.navFaq || (language === 'hi' ? 'प्रश्नोत्तरी (FAQ)' : 'FAQs')}</span>
            </button>

            <button
              id="nav-about-btn"
              onClick={() => setCurrentTab('about')}
              className={`px-4 py-3 transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'about'
                  ? 'bg-[#06243c] text-amber-300 border-b-4 border-amber-400 font-bold'
                  : 'text-slate-100 hover:bg-[#082e4b] hover:text-white'
              }`}
            >
              <span>{language === 'hi' ? 'मंत्रालय परिचय' : 'About Ministry'}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* 5. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B3B60] text-white border-t border-[#07243c] p-4 space-y-2">
          <button
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium ${
              currentTab === 'home' ? 'bg-[#06243c] text-amber-300 font-bold' : 'hover:bg-[#082e4b]'
            }`}
          >
            {language === 'hi' ? 'मुख्य पृष्ठ (Home)' : 'Home'}
          </button>
          <button
            onClick={() => { setCurrentTab('chat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium flex items-center gap-2 ${
              currentTab === 'chat' ? 'bg-[#06243c] text-amber-300 font-bold' : 'hover:bg-[#082e4b]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{language === 'hi' ? 'एआई सहकार मित्र (AI Sahayak)' : 'AI Sahayak (Chat)'}</span>
          </button>
          <button
            onClick={() => { setCurrentTab('services'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium ${
              currentTab === 'services' ? 'bg-[#06243c] text-amber-300 font-bold' : 'hover:bg-[#082e4b]'
            }`}
          >
            {language === 'hi' ? 'नागरिक व पैक्स सेवाएं' : 'Citizen & PACS Services'}
          </button>
          <button
            onClick={() => { setCurrentTab('schemes'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium ${
              currentTab === 'schemes' ? 'bg-[#06243c] text-amber-300 font-bold' : 'hover:bg-[#082e4b]'
            }`}
          >
            {language === 'hi' ? 'सरकारी योजनाएं' : 'Central Schemes'}
          </button>
          <button
            onClick={() => { setCurrentTab('guided'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium ${
              currentTab === 'guided' ? 'bg-[#06243c] text-amber-300 font-bold' : 'hover:bg-[#082e4b]'
            }`}
          >
            {language === 'hi' ? 'विधिक अधिनियम व नियम' : 'Acts & Bye-Laws Navigator'}
          </button>
          <button
            id="mobile-nav-faq-btn"
            onClick={() => { setCurrentTab('faq'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium flex items-center gap-2 ${
              currentTab === 'faq' ? 'bg-[#06243c] text-amber-300 font-bold' : 'hover:bg-[#082e4b]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>{t.navFaq || (language === 'hi' ? 'प्रश्नोत्तरी (FAQ)' : 'FAQs')}</span>
          </button>
          <button
            onClick={() => { setCurrentTab('about'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium ${
              currentTab === 'about' ? 'bg-[#06243c] text-amber-300 font-bold' : 'hover:bg-[#082e4b]'
            }`}
          >
            {language === 'hi' ? 'मंत्रालय परिचय' : 'About Ministry'}
          </button>
        </div>
      )}
    </header>
  );
};
