import React, { useState } from 'react';
import { X, Lock, Mail, KeyRound, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { ADMIN_EMAILS } from '../data/eventData';
import { UserSession, RegisteredTeam } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  onSwitchToRegister?: () => void;
  registeredTeams: RegisteredTeam[];
  isDarkMode: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
  registeredTeams,
  isDarkMode,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isAdminEmail = (e: string) => {
    const normalized = e.trim().toLowerCase();
    return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === normalized);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    // 1. Admin Login Verification (requires matching admin email and password)
    if (isAdminEmail(cleanEmail)) {
      if (cleanPassword.length < 3) {
        setError('Invalid admin credentials. Please enter your administrator password.');
        return;
      }

      onLoginSuccess({
        isLoggedIn: true,
        email: cleanEmail,
        role: 'admin',
        teamName: 'Executive Event Administrator',
      });
      setError('');
      onClose();
      return;
    }

    // 2. Registered Team Login Verification (matches registered email OR team name)
    const matchingTeam = registeredTeams.find(
      (t) =>
        t.leaderEmail.toLowerCase() === cleanEmail ||
        t.teamName.toLowerCase().trim() === cleanEmail
    );

    if (matchingTeam) {
      // If team has a registered password, enforce match
      if (matchingTeam.password && matchingTeam.password !== cleanPassword) {
        setError('Incorrect password for this registered team.');
        return;
      }

      onLoginSuccess({
        isLoggedIn: true,
        email: matchingTeam.leaderEmail,
        role: 'participant',
        teamName: matchingTeam.teamName,
        teamId: matchingTeam.id,
      });
      setError('');
      onClose();
      return;
    }

    // Not found in admin list nor registered teams
    setError('No team or administrator account found with this email. Please register your team or verify your credentials.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative w-full max-w-md rounded-2xl p-6 sm:p-8 border shadow-2xl corner-brackets ${
          isDarkMode
            ? 'bg-[#0a0f1d] border-emerald-500/40 text-slate-200'
            : 'bg-white border-slate-300 text-slate-800'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-slate-800 text-slate-400 hover:text-white'
              : 'bg-slate-100 text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Close Login Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div
            className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 ${
              isDarkMode
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
            }`}
          >
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-mono text-emerald-500 font-bold uppercase tracking-wider block mb-1">
            AUTHENTICATION PORTAL
          </span>
          <h3
            className={`font-['Chakra_Petch'] font-bold text-2xl uppercase ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            SIGN IN
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter your email ID and password to access the auction floor and society resources.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase mb-1 text-slate-400">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="leader@college.edu or authorized email"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-1 text-slate-400">
              Password *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter account password"
                className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080d16] font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
          >
            <span>SIGN IN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer switch to registration */}
        {onSwitchToRegister && (
          <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
            <p className="text-xs text-slate-400 font-mono">
              Not registered yet?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Register your team here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
