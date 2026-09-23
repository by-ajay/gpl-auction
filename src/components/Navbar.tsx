import React, { useState } from 'react';
import { Leaf, Menu, X, Wallet, Sun, Moon, LogIn, LogOut, Lock, ShieldCheck, User, Trophy } from 'lucide-react';
import { UserSession, NavigationTab } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenAdminPanel: () => void;
  userSession: UserSession;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenBudgetSimulator?: () => void;
  selectedItemsCount?: number;
  remainingBudget?: number;
  overallBudget?: number;
  isLiveBidActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenRegister,
  onOpenLogin,
  onOpenAdminPanel,
  userSession,
  onLogout,
  isDarkMode,
  onToggleTheme,
  onOpenBudgetSimulator,
  remainingBudget,
  overallBudget = 1000000,
  isLiveBidActive = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentRemaining = remainingBudget !== undefined ? remainingBudget : overallBudget;

  const navLinks: { label: string; tab: NavigationTab; badge?: string; isLive?: boolean; adminOnly?: boolean }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'About', tab: 'about' },
    { label: 'Rules', tab: 'rules' },
    { label: 'Resources', tab: 'resources' },
    { label: 'Auction Arena', tab: 'live-bid', isLive: true },
    {
      label: userSession.role === 'admin' ? 'Portfolios' : (userSession.role === 'participant' ? 'My Portfolio' : 'Portfolio'),
      tab: 'portfolio',
    },
    { label: 'Leaderboard', tab: 'leaderboard', adminOnly: true },
  ];

  // Strictly filter out admin-only sections for participants and guests
  const visibleNavLinks = navLinks.filter(
    (link) => !link.adminOnly || userSession.role === 'admin'
  );

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${
        isDarkMode
          ? 'bg-[#04130d] border-b border-emerald-950/70 py-2.5'
          : 'bg-[#f0fdf4] border-b border-emerald-200 py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo - Flat Minimal Environmental Emblem */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          id="nav-logo"
          className="flex items-center gap-2.5 group focus:outline-none text-left cursor-pointer transition-opacity hover:opacity-90"
        >
          <img
            src="/nss-logo.svg"
            alt="National Service Scheme Logo"
            className="w-9 h-9 object-contain rounded-full shadow-sm shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span
              className={`font-['Chakra_Petch'] font-bold text-base sm:text-lg tracking-wider uppercase leading-tight ${
                isDarkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-700'
              }`}
            >
              GREEN PREMIER LEAGUE
            </span>
            <span className="text-[10px] font-['Space_Mono'] uppercase tracking-widest text-emerald-500/90 dark:text-emerald-400/90 font-medium">
              BID GREEN, BUILD CHANGE
            </span>
          </div>
        </button>

        {/* Desktop Navigation - Flat Minimal Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {visibleNavLinks.map((link) => {
            const isActive = activeTab === link.tab;
            return (
              <button
                key={link.tab}
                type="button"
                onClick={() => handleNavClick(link.tab)}
                id={`nav-link-${link.tab}`}
                className={`text-xs font-['Space_Mono'] uppercase tracking-wider py-1.5 px-3 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? isDarkMode
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'bg-emerald-600 text-white font-bold'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-100/60'
                }`}
              >
                {link.tab === 'leaderboard' && (
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{link.label}</span>
                {link.adminOnly && userSession.role !== 'admin' && (
                  <Lock className="w-3 h-3 text-cyan-400" />
                )}
                {link.isLive && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isLiveBidActive ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
                    }`}
                  ></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Area - Flat Aesthetic */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-900/60 text-cyan-400'
                : 'bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light and Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Fund Indicator (If Logged In) */}
          {userSession.isLoggedIn && onOpenBudgetSimulator && (
            <button
              type="button"
              id="nav-budget-indicator"
              onClick={onOpenBudgetSimulator}
              className={`px-3 py-1.5 rounded-md border text-xs font-['Space_Mono'] flex items-center gap-2 transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-900/60 text-slate-200'
                  : 'bg-white hover:bg-emerald-50 border-emerald-200 text-slate-800'
              }`}
              title="View green treasury allocation"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fund:</span>
              <span className="text-emerald-400 font-bold">₹{currentRemaining.toLocaleString()}</span>
            </button>
          )}

          {/* Authentication & User Badges */}
          {userSession.isLoggedIn ? (
            <div className="flex items-center gap-2">
              {userSession.role === 'admin' ? (
                <button
                  type="button"
                  onClick={onOpenAdminPanel}
                  className="px-3 py-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ADMIN CONSOLE</span>
                </button>
              ) : (
                <div
                  className={`px-2.5 py-1.5 rounded-md border text-xs font-mono flex items-center gap-1.5 select-none ${
                    isDarkMode
                      ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-400'
                      : 'bg-white border-emerald-200 text-emerald-700'
                  }`}
                  title="Participant Delegation Verified"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{userSession.teamName || 'Team Verified'}</span>
                </div>
              )}

              <button
                type="button"
                onClick={onLogout}
                className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-900/60 text-slate-400 hover:text-white'
                    : 'bg-white hover:bg-emerald-50 border-emerald-200 text-slate-600'
                }`}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="nav-login-btn"
                onClick={onOpenLogin}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'bg-emerald-950/30 hover:bg-emerald-900/40 text-slate-200 border-emerald-900/60'
                    : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>SIGN IN</span>
              </button>

              <button
                type="button"
                id="nav-register-btn"
                onClick={onOpenRegister}
                className="px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                REGISTER
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              isDarkMode ? 'bg-emerald-950/30 border-emerald-900/60 text-cyan-400' : 'bg-white border-emerald-200 text-slate-700'
            }`}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              isDarkMode ? 'bg-emerald-950/30 border-emerald-900/60 text-slate-300' : 'bg-white border-emerald-200 text-slate-700'
            }`}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Flat */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-b px-4 py-4 mt-2 space-y-3 ${
            isDarkMode ? 'bg-[#04130d] border-emerald-950/80' : 'bg-[#f0fdf4] border-emerald-200'
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {visibleNavLinks.map((link) => {
              const isActive = activeTab === link.tab;
              return (
                <button
                  key={link.tab}
                  type="button"
                  onClick={() => handleNavClick(link.tab)}
                  className={`text-xs font-['Space_Mono'] uppercase tracking-wider py-2 px-3 rounded-md border flex items-center justify-between text-left ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                      : isDarkMode
                      ? 'bg-emerald-950/30 border-emerald-900/50 text-slate-300 hover:text-emerald-400'
                      : 'bg-white border-emerald-200 text-slate-800 hover:text-emerald-700'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isLive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {userSession.isLoggedIn ? (
              <div className="space-y-2">
                <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono flex items-center justify-between text-emerald-400">
                  <span>Logged in: {userSession.teamName || userSession.email}</span>
                  <button type="button" onClick={onLogout} className="text-cyan-400 underline font-bold">
                    Logout
                  </button>
                </div>
                {userSession.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminPanel();
                    }}
                    className="w-full py-2 rounded-md bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
                  >
                    Open Admin Console
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className={`py-2 rounded-md border text-xs font-mono font-bold uppercase ${
                    isDarkMode ? 'bg-emerald-950/30 border-emerald-900/60 text-white' : 'bg-white border-emerald-200 text-slate-900'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="py-2 rounded-md bg-emerald-500 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase"
                >
                  REGISTER
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
