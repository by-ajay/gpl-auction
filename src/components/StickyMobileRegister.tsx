import React from 'react';
import { ArrowRight, Wallet, Lock, Gavel } from 'lucide-react';
import { UserSession, NavigationTab } from '../types';

interface StickyMobileRegisterProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
  userSession: UserSession;
  remainingBudget: number;
  isDarkMode: boolean;
}

export const StickyMobileRegister: React.FC<StickyMobileRegisterProps> = ({
  onOpenRegister,
  onOpenLogin,
  onNavigateTab,
  userSession,
  remainingBudget,
  isDarkMode,
}) => {
  return (
    <div
      id="sticky-mobile-register-bar"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t p-3 shadow-2xl transition-colors ${
        isDarkMode
          ? 'bg-[#04130d]/95 border-emerald-950/80'
          : 'bg-white/95 border-emerald-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {userSession.isLoggedIn ? (
          <>
            <button
              type="button"
              onClick={() => onNavigateTab('portfolio')}
              className="flex items-center gap-2 text-xs font-mono text-left cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isDarkMode
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
                }`}
              >
                <Wallet className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-slate-400 block uppercase">FUND</span>
                <span className="text-emerald-500 font-bold">₹{remainingBudget.toLocaleString()}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('live-bid')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>AUCTION ARENA</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onOpenLogin}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold uppercase flex items-center justify-center gap-1 cursor-pointer ${
                isDarkMode ? 'bg-emerald-950/40 border-emerald-900/60 text-slate-200' : 'bg-white border-emerald-200 text-slate-800'
              }`}
            >
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>SIGN IN</span>
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>REGISTER TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
