import React from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck, Database, SlidersHorizontal } from 'lucide-react';

interface LockedAuctionTeaserProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  isDarkMode: boolean;
}

export const LockedAuctionTeaser: React.FC<LockedAuctionTeaserProps> = ({
  onOpenRegister,
  onOpenLogin,
  isDarkMode,
}) => {
  return (
    <section
      id="auction"
      className={`py-20 relative border-b overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-[#03130c] border-emerald-950/60 text-slate-200'
          : 'bg-[#f0fbf4] border-emerald-200 text-slate-800'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-['Space_Mono'] text-emerald-500 font-medium mb-5">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>AUCTION FLOOR ACCESS</span>
        </div>

        <h2
          className={`font-['Chakra_Petch'] font-black text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase mb-4 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          AUCTION RESOURCES LOCKED
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-sans leading-relaxed mb-8">
          The catalog of <strong className="text-emerald-500">100 societal auction resources</strong>, reserve prices, societal impacts, and the interactive <strong className="text-emerald-500">Society Fund Budget Simulator</strong> are unlocked for registered teams.
        </p>

        {/* Minimal Clean Card */}
        <div
          className={`p-8 sm:p-10 rounded-2xl border max-w-2xl mx-auto mb-10 transition-all ${
            isDarkMode
              ? 'bg-[#041d13]/80 border-emerald-900/60 shadow-xl'
              : 'bg-white border-emerald-200 shadow-md'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h3
            className={`font-['Chakra_Petch'] font-bold text-xl uppercase mb-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Sign In or Register to Access the Floor
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            Already registered your team? Sign in with your leader email to access the live catalog and budget planner. New teams can register in seconds for free.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>REGISTER TEAM (FREE)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className={`px-6 py-3 rounded-xl font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider border transition-colors flex items-center gap-2 cursor-pointer ${
                isDarkMode
                  ? 'bg-emerald-950/40 hover:bg-emerald-900/50 text-white border-emerald-900/60'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
              }`}
            >
              <KeyRound className="w-4 h-4 text-emerald-500" />
              <span>SIGN IN WITH TEAM EMAIL</span>
            </button>
          </div>
        </div>

        {/* 3 Simple highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto text-xs font-mono text-slate-400">
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white/50 dark:bg-emerald-950/20 flex flex-col items-center text-center">
            <Database className="w-4 h-4 text-emerald-500 mb-1.5" />
            <span className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">100 Civic Assets</span>
            <span>Complete impact briefs & reserve pricing</span>
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white/50 dark:bg-emerald-950/20 flex flex-col items-center text-center">
            <SlidersHorizontal className="w-4 h-4 text-emerald-500 mb-1.5" />
            <span className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Budget Simulator</span>
            <span>Allocate your ₹10,00,000 societal budget</span>
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white/50 dark:bg-emerald-950/20 flex flex-col items-center text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1.5" />
            <span className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Official Team Pass</span>
            <span>Auditorium floor verification badge</span>
          </div>
        </div>
      </div>
    </section>
  );
};
