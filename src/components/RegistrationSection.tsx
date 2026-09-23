import React from 'react';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { UserSession } from '../types';

interface RegistrationSectionProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  userSession: UserSession;
  isDarkMode: boolean;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  onOpenRegister,
  onOpenLogin,
  userSession,
  isDarkMode,
}) => {
  return (
    <section
      id="register"
      className={`py-24 relative border-b overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#070c16] border-white/5 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}
    >
      {/* Blueprint grid background */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Tag with NSS Logo */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Space_Mono'] uppercase tracking-widest mb-6 border ${
            isDarkMode
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <img
            src="/nss-logo.svg"
            alt="NSS Logo"
            className="w-4 h-4 object-contain rounded-full shrink-0"
          />
          <span>NSS OFFICIAL ACCREDITATION // LIMITED TEAM SLOTS</span>
        </div>

        {/* Title strictly as requested */}
        <h2
          className={`font-['Chakra_Petch'] font-black text-4xl sm:text-6xl md:text-7xl tracking-tight uppercase mb-6 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          READY TO BUILD?
        </h2>

        {/* Sub-statements strictly as requested */}
        <div className="max-w-xl mx-auto space-y-2 mb-10 text-lg sm:text-2xl font-['Chakra_Petch'] uppercase tracking-wide">
          <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Your budget is limited.</p>
          <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Your choices are permanent.</p>
          <p className="text-emerald-500 font-bold text-xl sm:text-3xl">
            Your vision is unlimited.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {userSession.isLoggedIn ? (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-mono ${
                isDarkMode
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>
                Logged in as <strong>{userSession.teamName || userSession.email}</strong>. Head to the Resource Catalog to inspect your unlocked assets.
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                id="register-main-cta-btn"
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-8 py-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-extrabold text-base tracking-wider uppercase transition-all duration-300 shadow-2xl shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>REGISTER FOR GREEN PREMIER LEAGUE</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onOpenLogin}
                className={`w-full sm:w-auto px-6 py-5 rounded-xl border font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>ALREADY REGISTERED? SIGN IN</span>
              </button>
            </div>
          )}
        </div>

        {/* College & NSS Participant Details Bar with editable placeholders */}
        <div
          className={`mt-12 pt-8 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-['Space_Mono'] ${
            isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
          }`}
        >
          <div
            className={`p-3 rounded-xl border ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-300'
            }`}
          >
            <span className="text-slate-400 uppercase block mb-1">DATE & SCHEDULE</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {EVENT_DETAILS.datePlaceholder}
            </span>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-300'
            }`}
          >
            <span className="text-slate-400 uppercase block mb-1">VENUE & HOST</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {EVENT_DETAILS.venuePlaceholder}
            </span>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-300'
            }`}
          >
            <span className="text-slate-400 uppercase block mb-1">ENTRY / REGISTRATION</span>
            <span className="text-emerald-500 font-semibold">{EVENT_DETAILS.feePlaceholder}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
