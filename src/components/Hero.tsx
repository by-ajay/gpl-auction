import React from 'react';
import { ArrowRight, Compass, Gavel, Lock, Sparkles, Coins, Users, Award, Calendar, MapPin, CheckCircle2, Radio, Leaf, Sprout, Trees } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { UserSession, NavigationTab } from '../types';

interface HeroProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
  userSession: UserSession;
  overallBudget: number;
  isDarkMode: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenRegister,
  onOpenLogin,
  onNavigateTab,
  userSession,
  overallBudget,
  isDarkMode,
}) => {
  return (
    <section
      id="hero"
      className={`relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b transition-colors ${
        isDarkMode ? 'bg-[#04130d] border-emerald-950/60 bg-blueprint-grid' : 'bg-[#f4f9f5] border-emerald-200/80 bg-blueprint-grid'
      }`}
    >
      {/* Ambient botanical glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-emerald-500/12 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Clear, accessible headline & actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Minimal Badge with NSS Logo */}
            <div
              id="hero-event-badge"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-['Space_Mono'] font-medium tracking-wide mb-6 border transition-all ${
                isDarkMode
                  ? 'bg-[#072518]/90 border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'bg-emerald-100/80 border-emerald-300 text-emerald-800 shadow-sm'
              }`}
            >
              <img
                src="/nss-logo.svg"
                alt="NSS Logo"
                className="w-4 h-4 object-contain rounded-full shrink-0"
              />
              <span>GREEN PREMIER LEAGUE // 2026 EDITION</span>
            </div>

            {/* Title: GREEN PREMIER LEAGUE */}
            <h1
              id="hero-headline"
              className={`font-['Chakra_Petch'] font-black text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.02] uppercase mb-3 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              GREEN PREMIER <span className="text-emerald-500">LEAGUE</span>
            </h1>

            {/* Subheading / Tagline: Bid Green, Build Change */}
            <h2
              id="hero-subheading"
              className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-normal mb-4 flex items-center gap-2 font-['Chakra_Petch']"
            >
              <Sprout className="w-5 h-5 shrink-0 text-emerald-500" />
              <span>&ldquo;Bid Green, Build Change&rdquo;</span>
            </h2>

            {/* Description */}
            <p
              id="hero-supporting-text"
              className={`text-base sm:text-lg font-sans leading-relaxed max-w-xl mb-8 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Student delegations receive an eco-treasury of <strong>₹{overallBudget.toLocaleString()}</strong> to bid in real-time on 100 vital environmental and civic assets—including renewable energy, clean water, eco-mobility, and flood resilience. Every resource is exclusive and awarded to only one winning team.
            </p>

            {/* Action buttons: smooth, minimal, functional */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              {!userSession.isLoggedIn ? (
                <>
                  <button
                    type="button"
                    id="hero-cta-register"
                    onClick={onOpenRegister}
                    className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase transition-all duration-150 ease-out active:scale-[0.98] shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <Leaf className="w-4 h-4 text-slate-950" />
                    <span>REGISTER YOUR TEAM</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className={`px-7 py-3.5 rounded-xl border font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase transition-all duration-150 ease-out active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isDarkMode
                        ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-emerald-900/60 hover:border-emerald-500'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-emerald-500 shadow-sm'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span>SIGN IN</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('live-bid')}
                    className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase transition-all duration-150 ease-out active:scale-[0.98] shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <Gavel className="w-4 h-4 text-slate-950" />
                    <span>ENTER LIVE BIDDING ARENA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateTab('resources')}
                    className={`px-6 py-3.5 rounded-xl border font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase transition-all duration-150 ease-out active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isDarkMode
                        ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-emerald-900/60 hover:border-emerald-500'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-emerald-500 shadow-sm'
                    }`}
                  >
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    <span>EXPLORE 28 CIVIC ASSETS</span>
                  </button>
                </div>
              )}
            </div>

            {/* High-contrast key event details strip */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t w-full max-w-2xl ${
                isDarkMode ? 'border-emerald-950/60' : 'border-emerald-200/80'
              }`}
            >
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase block">EVENT DATE</span>
                <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  24 September 2026
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase block">VENUE</span>
                <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Gallery Hall III, Block V
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase block">TEAM BUDGET</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-500 font-mono">
                  ₹{overallBudget.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase block">FORMAT</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-500 truncate block">
                  Live Premier Auction
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: "How The Event Works" */}
          <div className="lg:col-span-5 w-full">
            <div
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-[#072116]/85 border-emerald-900/50 shadow-xl shadow-black/40'
                  : 'bg-white border-emerald-200/80 shadow-md'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 border-b border-emerald-900/40 dark:border-emerald-900/40 mb-6">
                <div>
                  <h3
                    className={`font-['Chakra_Petch'] font-bold text-lg uppercase tracking-wider ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    HOW THE LEAGUE WORKS
                  </h3>
                  <p className="text-xs text-emerald-500/80 font-mono mt-0.5">
                    Bid Green, Build Change • 3 Core Pillars
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-500/30 flex items-center justify-center p-0.5 bg-emerald-950/40 shrink-0">
                  <img
                    src="/nss-logo.svg"
                    alt="NSS Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 3 Simple Steps */}
              <div className="space-y-4">
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3.5 ${
                    isDarkMode ? 'bg-[#04130d]/80 border-emerald-950/80' : 'bg-emerald-50/50 border-emerald-200/60'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-['Chakra_Petch'] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Receive Your ₹{overallBudget.toLocaleString()} Treasury
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Every confirmed student delegation begins with equal green capital to allocate across societal needs.
                    </p>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3.5 ${
                    isDarkMode ? 'bg-[#04130d]/80 border-emerald-950/80' : 'bg-emerald-50/50 border-emerald-200/60'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-['Chakra_Petch'] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Single-Team Exclusivity
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Each of the 28 civic resources can only be acquired by one team. When the hammer falls, it is locked.
                    </p>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3.5 ${
                    isDarkMode ? 'bg-[#04130d]/80 border-emerald-950/80' : 'bg-emerald-50/50 border-emerald-200/60'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-['Chakra_Petch'] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Live Timer &amp; Real-Time Bidding
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Admins launch timed live auction rounds with countdowns and instant hammer settlement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Logistics footer badge */}
              <div
                className={`mt-6 pt-5 border-t flex items-center justify-between text-xs font-mono ${
                  isDarkMode ? 'border-emerald-950/80 text-slate-400' : 'border-emerald-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Gallery Hall III</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>2–4 Members</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Free Entry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
