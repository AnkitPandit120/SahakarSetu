import React, { useState } from 'react';
import { X, User, Lock, Mail, Shield, Check } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  user,
  onLogin,
  onLogout
}) => {
  const t = TRANSLATIONS[language];
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'FARMER' | 'PACS_MEMBER' | 'CITIZEN'>('FARMER');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: fullName || 'Citizen User',
        email: email || 'citizen@example.com',
        role,
        savedQueries: [],
        bookmarkedSchemes: []
      };
      onLogin(newUser);
    } else {
      const existingUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: email ? email.split('@')[0] : 'Citizen Member',
        email: email || 'citizen@example.com',
        role: 'FARMER',
        savedQueries: [],
        bookmarkedSchemes: []
      };
      onLogin(existingUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          // Logged in user profile state
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span className="inline-block mt-1 text-[11px] font-semibold uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                <div className="font-bold text-slate-900 mb-1">{t.savedQueriesTitle}</div>
                <p>Your portal history and bookmarked guidelines are securely saved.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors"
              >
                {t.logoutBtn}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          // Login / Register Form
          <div>
            <div className="mb-5">
              <div className="inline-flex items-center gap-1 text-slate-700 text-xs font-semibold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 mb-2">
                <Shield className="w-3.5 h-3.5 text-slate-700" />
                <span>Optional Citizen Access</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {isRegister ? t.registerTitle : t.loginTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.guestNote}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                />
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.roleLabel}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                  >
                    <option value="FARMER">{t.farmerRole}</option>
                    <option value="PACS_MEMBER">{t.pacsRole}</option>
                    <option value="CITIZEN">{t.citizenRole}</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                {isRegister ? t.registerBtn : t.loginBtn}
              </button>
            </form>

            {/* Toggle switch between login / register */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-slate-900 hover:text-slate-700 font-medium"
              >
                {isRegister ? t.haveAccount : t.noAccount}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-800 underline mt-1"
              >
                {t.continueAsGuest}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
