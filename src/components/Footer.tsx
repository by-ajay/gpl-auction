import React from 'react';
import { Hammer, Mail, ArrowUp, Lock, ShieldCheck, Calendar, MapPin, Leaf, Sprout, Trees } from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  isAdmin?: boolean;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenRegister,
  onOpenLogin,
  isAdmin = false,
  isDarkMode,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allNavLinks: { label: string; tab: NavigationTab; adminOnly?: boolean }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'About', tab: 'about' },
    { label: 'Rules & Protocols', tab: 'rules' },
    { label: '28 Civic Resources', tab: 'resources' },
    { label: 'Live Bidding Floor', tab: 'live-bid' },
    { label: 'Team Portfolio', tab: 'portfolio' },
  ];

  const navLinks = allNavLinks.filter((link) => !link.adminOnly || isAdmin);

  return (
    <footer
      className={`font-sans border-t relative overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#030d09] text-slate-400 border-emerald-950/80' : 'bg-[#eef6f0] text-slate-600 border-emerald-200'
      }`}
    >
      {/* Blueprint grid background */}
      <div className="absolute inset-0 bg-blueprint-fine opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-950/40 dark:border-emerald-950/40">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/nss-logo.svg"
                alt="National Service Scheme Logo"
                className="w-11 h-11 object-contain rounded-full shadow-md shrink-0 border border-emerald-500/40"
              />
              <div>
                <h3
                  className={`font-['Chakra_Petch'] font-black text-lg uppercase tracking-wider ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  GREEN PREMIER LEAGUE
                </h3>
                <p className="text-xs font-['Space_Mono'] text-emerald-500 uppercase font-semibold">
                  National Service Scheme • &ldquo;Bid Green, Build Change&rdquo;
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-slate-400">
              Delegations compete in real time for 28 exclusive civic, renewable, and ecological assets with single-buyer exclusivity.
            </p>

            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Environment &amp; Civic Strategic Auction</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Date: 24 September 2026</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Venue: Gallery Hall III, Block V</span>
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4
              className={`font-['Chakra_Petch'] font-bold text-sm uppercase tracking-wider ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Event Navigation
            </h4>
            <ul className="space-y-2 text-xs font-['Space_Mono']">
              {navLinks.map((link) => (
                <li key={link.tab}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab(link.tab);
                      scrollToTop();
                    }}
                    className="hover:text-emerald-500 transition-colors flex items-center gap-1.5 text-left cursor-pointer active:scale-95"
                  >
                    <span className="text-emerald-500/60">›</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Auction Categories */}
          <div className="space-y-3">
            <h4
              className={`font-['Chakra_Petch'] font-bold text-sm uppercase tracking-wider ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              28 Gated Assets
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li>Vital Infrastructure (5)</li>
              <li>Human Welfare &amp; Health (5)</li>
              <li>Environment &amp; Ecology (5)</li>
              <li>Civic Resilience &amp; Safety (5)</li>
              <li>Economy &amp; Innovation (4)</li>
              <li>Governance &amp; Digital (4)</li>
              <li className="text-[11px] text-emerald-500 font-semibold pt-1">
                * Single-Buyer Exclusivity
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-4">
            <h4
              className={`font-['Chakra_Petch'] font-bold text-sm uppercase tracking-wider ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Access Portals
            </h4>
            <p className="text-xs text-slate-400">
              Only authenticated teams can bid in real-time. Portfolios are strictly reserved for administrative review.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={onOpenLogin}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#072116] hover:bg-emerald-950 text-slate-200 border-emerald-900/60'
                    : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200 shadow-sm'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>SIGN IN</span>
              </button>

              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider transition-all duration-150 ease-out active:scale-[0.98] shadow-sm shadow-emerald-500/20 cursor-pointer"
              >
                REGISTER NEW TEAM
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-['Space_Mono']">
          <div className="flex items-center gap-2 flex-wrap">
            <span>© 2026 GREEN PREMIER LEAGUE.</span>
            <span>•</span>
            <span className="text-emerald-500 font-medium">All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-semibold tracking-wide">&ldquo;BID GREEN, BUILD CHANGE&rdquo;</span>
            <button
              type="button"
              onClick={scrollToTop}
              className={`p-2 rounded-lg border transition-all duration-150 ease-out active:scale-95 cursor-pointer ${
                isDarkMode
                  ? 'bg-[#072116] hover:bg-emerald-950 border-emerald-900/60 text-slate-400 hover:text-white'
                  : 'bg-white hover:bg-emerald-50 border-emerald-200 text-slate-700'
              }`}
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
