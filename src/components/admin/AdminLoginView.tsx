import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Key,
  RefreshCw,
  Info,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AdminLoginViewProps {
  language: 'en' | 'hi';
  usernameInput: string;
  setUsernameInput: (val: string) => void;
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  securityCodeInput: string;
  setSecurityCodeInput: (val: string) => void;
  loginError: string | null;
  isLoggingIn: boolean;
  onLogin: (e: React.FormEvent) => void;
  onFillPresetCredentials: () => void;
  onExitToCitizenView: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  language,
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
  securityCodeInput,
  setSecurityCodeInput,
  loginError,
  isLoggingIn,
  onLogin,
  onFillPresetCredentials,
  onExitToCitizenView
}) => {
  const isHi = language === 'hi';

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
        {/* Official Header Strip */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-7 text-center relative">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-3 border border-white/20">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {isHi ? 'सहकारिता मंत्रालय • प्रशासनिक नियंत्रण कक्ष' : 'Ministry of Cooperation • Admin Portal'}
          </h2>
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mt-1">
            {isHi ? 'वैधानिक RAG एवं ज्ञानकोष नियंत्रण प्रणाली' : 'Statutory RAG & Knowledge Governance System'}
          </p>
          <div className="text-[11px] text-slate-300 mt-2 font-medium">
            {isHi
              ? 'अधिकृत मंत्रालय अधिकारियों एवं ज्ञान समन्वयकों के लिए सुरक्षित पहुंच'
              : 'Restricted Portal Access for Authorized Ministry Officials & Nodal Officers'}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={onLogin} className="p-6 sm:p-8 space-y-5">
          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-ping"></span>
              <span className="font-semibold">{loginError}</span>
            </div>
          )}

          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span>{isHi ? 'प्रशासक यूज़रनेम या ईमेल' : 'Administrator Username or Email'}</span>
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={e => setUsernameInput(e.target.value)}
              placeholder="e.g. ministry_admin or admin@sahakar.nic.in"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-medium"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>{isHi ? 'गोपनीय पासवर्ड' : 'Secret Password'}</span>
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-medium"
            />
          </div>

          {/* Security Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'मंत्रालय नोडल सुरक्षा कोड' : 'Ministry Nodal Security Code'}</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">{isHi ? 'वैकल्पिक' : 'Optional'}</span>
            </div>
            <input
              type="text"
              value={securityCodeInput}
              onChange={e => setSecurityCodeInput(e.target.value)}
              placeholder="e.g. GOV-IND-7789"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoggingIn ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>{isHi ? 'सत्यापित किया जा रहा है...' : 'Authenticating...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'प्रशासक सत्र प्रारंभ करें' : 'Authenticate & Enter Admin Console'}</span>
              </>
            )}
          </button>

          {/* Test Credentials Helper Card */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-amber-900">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                <span>{isHi ? 'अधिकृत परीक्षण क्रेडेंशियल (Nodal Credentials):' : 'Official Test Credentials (Nodal):'}</span>
              </span>
              <button
                type="button"
                onClick={onFillPresetCredentials}
                className="text-amber-800 hover:text-amber-950 font-extrabold underline cursor-pointer"
              >
                {isHi ? 'स्वतः भरें (Auto-Fill)' : 'Auto-Fill'}
              </button>
            </div>
            <div className="font-mono text-[11px] space-y-1 text-slate-700 bg-white/80 p-2.5 rounded-xl border border-amber-100">
              <div>User: <span className="text-slate-900 font-bold">ministry_admin</span> or <span className="text-slate-900 font-bold">admin@sahakar.nic.in</span></div>
              <div>Password: <span className="text-slate-900 font-bold">Sahakar@Admin2026</span></div>
              <div>Security Code: <span className="text-emerald-700 font-bold">GOV-IND-7789</span></div>
            </div>
          </div>

          {/* Back link */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onExitToCitizenView}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isHi ? 'नागरिक पोर्टल पर वापस लौटें' : 'Back to Public Citizen Portal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
