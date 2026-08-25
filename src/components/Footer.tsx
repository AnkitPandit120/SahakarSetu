import React from 'react';
import { Shield, PhoneCall, Landmark, Scale, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer id="app-footer" className="bg-white border-t border-slate-200">
      {/* Helpline Alert Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{t.helplineTitle}</h4>
              <p className="text-[11px] text-slate-500">Toll-free public assistance across all states & Union Territories</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 text-xs">
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium shadow-2xs">
              {t.helplineKisan}
            </div>
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium shadow-2xs">
              {t.helplinePmfby}
            </div>
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium shadow-2xs">
              {t.helplineConsumer}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Citations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center">
                <Landmark className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">
                {t.appName}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              {t.appSubtitle}. Built to empower rural citizens, cooperative members, farmers, and PACS personnel with plain-language, cited guidance.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium pt-1">
              <Scale className="w-3.5 h-3.5 text-slate-700" />
              <span>Multi-State Cooperative Societies Act & Model PACS Bye-laws</span>
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
              Official Portals
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <a
                  href="https://cooperation.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>Ministry of Cooperation</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://crcs.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>CRCS Multi-State Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmfby.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>PMFBY Crop Insurance</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Accessibility */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
              Verification Standards
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Source-First RAG Grounding</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Plain Language Explanations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>English, Hindi, Marathi, Bengali</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Voice Microphone Enabled</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
          <div className="flex items-start gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{t.legalDisclaimerHeader}:</strong> {t.footerDisclaimer} {t.legalDisclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Sleek bottom status bar */}
      <div className="px-4 sm:px-8 py-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-600 cursor-pointer">Legal Disclaimer</span>
          <span className="hover:text-slate-600 cursor-pointer">Contact Support</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>System Status: Fully Operational</span>
        </div>
      </div>
    </footer>
  );
};
