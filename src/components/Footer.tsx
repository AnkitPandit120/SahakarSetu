import React from 'react';
import {
  Shield,
  PhoneCall,
  Landmark,
  Scale,
  ExternalLink,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Download
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer id="app-footer" className="bg-[#0B3B60] text-white border-t-4 border-amber-400">
      {/* 1. National Helplines Strip */}
      <div className="bg-[#07253d] border-b border-[#124b7a] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-amber-300">
              {language === 'hi' ? 'राष्ट्रीय टोल-फ्री हेल्पलाइन:' : 'National Citizen Helplines:'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-white/10 px-2.5 py-1 rounded border border-white/20 text-slate-200">
              {language === 'hi' ? 'किसान कॉल सेंटर:' : 'Kisan Helpline:'} <strong className="text-amber-300 font-mono">1800-180-1551</strong>
            </div>
            <div className="bg-white/10 px-2.5 py-1 rounded border border-white/20 text-slate-200">
              {language === 'hi' ? 'फसल बीमा (PMFBY):' : 'PMFBY Helpline:'} <strong className="text-amber-300 font-mono">14447</strong>
            </div>
            <div className="bg-white/10 px-2.5 py-1 rounded border border-white/20 text-slate-200">
              {language === 'hi' ? 'राष्ट्रीय उपभोक्ता हेल्पलाइन:' : 'National Consumer Helpline:'} <strong className="text-amber-300 font-mono">1915</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Departmental Directory & Official Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Ministry Info & Address */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Landmark className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <span className="font-black text-sm text-white tracking-tight block">
                  सहकार सेतु | SAHAKAR SETU
                </span>
                <span className="text-[10px] text-amber-200">
                  Government of India
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-[11px]">
              {language === 'hi'
                ? 'सहकारिता मंत्रालय, भारत सरकार का आधिकारिक विधिक एवं प्रशासनिक मार्गदर्शन पोर्टल।'
                : 'Official legal advisory, statutory act repository, and public governance assistance portal of the Ministry of Cooperation.'}
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-[#1a517f]">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Atal Akshay Urja Bhawan, CGO Complex, Lodhi Road, New Delhi - 110003</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>support-cooperation@gov.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Central Government Portals */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-[#1a517f] pb-1">
              {language === 'hi' ? 'प्रमुख सरकारी पोर्टल' : 'Official Central Portals'}
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>
                <a
                  href="https://cooperation.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Ministry of Cooperation</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://crcs.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>CRCS Multi-State Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmfby.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>PMFBY Crop Insurance</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>PM-KISAN Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>National Portal of India (india.gov.in)</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Acts & Documents */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-[#1a517f] pb-1">
              {language === 'hi' ? 'वैधानिक अधिनियम व नियम' : 'Statutory Acts & Bye-Laws'}
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>
                <a
                  href="https://crcs.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Multi-State Co-operative Societies Act 2002</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://cooperation.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>MSCS (Amendment) Act 2023 Rules</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://cooperation.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Model PACS Bye-Laws 2024</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://nabard.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>NABARD KCC Guidelines</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Website Policies & Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-[#1a517f] pb-1">
              {language === 'hi' ? 'वेबसाइट नीतियां' : 'Website Policies'}
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="hover:text-amber-300 cursor-pointer">Copyright Policy</li>
              <li className="hover:text-amber-300 cursor-pointer">Hyperlinking Policy</li>
              <li className="hover:text-amber-300 cursor-pointer">Privacy & Security Policy</li>
              <li className="hover:text-amber-300 cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-amber-300 cursor-pointer">GIGW 3.0 Compliance</li>
              <li className="hover:text-amber-300 cursor-pointer">Help & Feedback</li>
              <li className="pt-2">
                <a
                  href="/api/download-images"
                  download="sahakarsetu_all_images.zip"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-sm text-xs"
                  title="Download all project images in a single ZIP file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सभी चित्र डाउनलोड करें (.ZIP)' : 'Download All Images (.ZIP)'}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-8 pt-4 border-t border-[#1a517f] text-[11px] text-slate-300 space-y-1">
          <div className="flex items-start gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-slate-300">
              <strong>{t.legalDisclaimerHeader}:</strong> {t.footerDisclaimer} {t.legalDisclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Official NIC / National Portal Accreditation Footer */}
      <div className="px-4 sm:px-8 py-3 bg-[#071f33] border-t border-[#124b7a] text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div>
            <span>Website Content Managed by <strong>Ministry of Cooperation, Government of India</strong></span>
            <span className="hidden sm:inline"> • Designed and Hosted by <strong>National Informatics Centre (NIC)</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
            <span>Last Updated: <strong>25 Aug 2026</strong></span>
            <span>•</span>
            <span>Visitors: <strong>1,489,230</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
