import React, { useState, useMemo } from 'react';
import { RegisteredTeam, AuctionItem, UserSession } from '../types';
import {
  Briefcase,
  Layers,
  Wallet,
  Users,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Search,
  Sparkles,
  TrendingUp,
  Tag,
  Coins,
  ShieldCheck,
  PlusCircle,
  Lock,
  Gavel,
  Shield,
  ExternalLink,
  Eye,
} from 'lucide-react';

interface PortfolioSectionProps {
  registeredTeams: RegisteredTeam[];
  auctionItems: AuctionItem[];
  userSession: UserSession;
  overallBudget: number;
  onSelectResource: (item: AuctionItem) => void;
  onExploreAuction?: () => void;
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
  isDarkMode: boolean;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  registeredTeams,
  auctionItems,
  userSession,
  overallBudget,
  onSelectResource,
  onExploreAuction,
  onOpenLogin,
  onOpenRegister,
  isDarkMode,
}) => {
  // Admin-only state for viewing any team's detailed modal
  const [selectedTeam, setSelectedTeam] = useState<RegisteredTeam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = userSession.role === 'admin';
  const isParticipant = userSession.role === 'participant';
  const isGuest = !userSession.isLoggedIn || userSession.role === 'guest';

  // Helper to get resources won/drafted for a given team
  const getTeamAssets = (team: RegisteredTeam | null | undefined): AuctionItem[] => {
    if (!team) return [];
    return auctionItems.filter((item) => {
      const isSoldToThisTeam =
        item.status === 'sold' &&
        Boolean(item.soldToTeam) &&
        item.soldToTeam?.toLowerCase().trim() === team.teamName?.toLowerCase().trim();
      const isDraftedInTeam =
        Array.isArray(team.draftedResourceIds) && team.draftedResourceIds.includes(item.id);
      return isSoldToThisTeam || isDraftedInTeam;
    });
  };

  // Distinct category badge styling helper
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Vital Infrastructure':
        return isDarkMode
          ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
          : 'bg-sky-50 text-sky-700 border-sky-300';
      case 'Human Welfare':
        return isDarkMode
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'Environment & Ecology':
        return isDarkMode
          ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
          : 'bg-teal-50 text-teal-700 border-teal-300';
      case 'Civic Resilience':
        return isDarkMode
          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          : 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Economy & Innovation':
        return isDarkMode
          ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
          : 'bg-indigo-50 text-indigo-700 border-indigo-300';
      case 'Governance & Digital':
        return isDarkMode
          ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
          : 'bg-purple-50 text-purple-700 border-purple-300';
      default:
        return isDarkMode
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : 'bg-emerald-50 text-emerald-700 border-emerald-300';
    }
  };

  // ----------------------------------------------------------------------
  // SCENARIO 1: PARTICIPANT VIEW
  // Each team should only be able to view its own portfolio.
  // Portfolios belonging to other teams must remain inaccessible and hidden.
  // ----------------------------------------------------------------------
  const participantTeam = useMemo(() => {
    if (!isParticipant) return null;
    const matched = registeredTeams.find(
      (t) =>
        (userSession.teamId && t.id.toLowerCase().trim() === userSession.teamId.toLowerCase().trim()) ||
        (userSession.teamName && t.teamName.toLowerCase().trim() === userSession.teamName.toLowerCase().trim()) ||
        (userSession.email && t.leaderEmail.toLowerCase().trim() === userSession.email.toLowerCase().trim())
    );
    if (matched) return matched;

    // Fallback if session is participant but storage is synchronizing
    if (userSession.teamName || userSession.teamId) {
      return {
        id: userSession.teamId || 'DELEGATION-PORTFOLIO',
        teamName: userSession.teamName || 'Your Delegation Team',
        collegeOrDept: 'Registered Delegation',
        memberNames: [userSession.teamName || 'Team Leader'],
        leaderEmail: userSession.email || '',
        leaderPhone: 'Registered Participant',
        registeredAt: 'Active League Session',
        role: 'participant' as const,
        status: 'approved' as const,
        fictionalBudget: overallBudget,
      };
    }
    return null;
  }, [isParticipant, registeredTeams, userSession, overallBudget]);

  if (isParticipant && participantTeam) {
    const assets = getTeamAssets(participantTeam);
    const budget = participantTeam.fictionalBudget || overallBudget;
    const spent = assets.reduce(
      (sum, item) => sum + (item.soldPrice || item.startingPrice),
      0
    );
    const remaining = Math.max(0, budget - spent);
    const spentPct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
    const remainingPct = Math.max(0, 100 - spentPct);

    // Group assets by category
    const categoryCounts: Record<string, number> = {};
    assets.forEach((a) => {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    });

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Participant Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-700/40">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Space_Mono'] uppercase tracking-wider border ${
                  isDarkMode
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span>MY DELEGATION PORTFOLIO // {participantTeam.id}</span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>VERIFIED TEAM</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-slate-800/80 text-slate-300 border border-slate-700">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>PRIVATE &amp; EXCLUSIVE</span>
              </span>
            </div>

            <h2
              className={`font-['Chakra_Petch'] font-black text-3xl sm:text-4xl uppercase tracking-tight mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {participantTeam.teamName}
            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-400 font-sans">
              <Building2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{participantTeam.collegeOrDept || 'Registered Delegation'}</span>
            </div>
          </div>

          {/* Quick CTA to Live Arena */}
          {onExploreAuction && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={onExploreAuction}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                <span>ENTER LIVE BIDDING ARENA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>TOTAL ECO-TREASURY</span>
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">
              ₹{budget.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-slate-500 block mt-1">
              Base league capital allocation
            </span>
          </div>

          <div
            className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
              <span>AUCTION SPEND</span>
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
              ₹{spent.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-slate-500 block mt-1">
              {spentPct}% utilized in bidding
            </span>
          </div>

          <div
            className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>REMAINING CAPITAL</span>
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
              ₹{remaining.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-slate-500 block mt-1">
              {remainingPct}% available for bidding
            </span>
          </div>

          <div
            className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>WON CIVIC ASSETS</span>
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
              {assets.length} {assets.length === 1 ? 'Resource' : 'Resources'}
            </span>
            <span className="text-[11px] font-mono text-slate-500 block mt-1">
              Single-buyer exclusivity
            </span>
          </div>
        </div>

        {/* Treasury Utilization Visual Bar */}
        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 uppercase tracking-wider">
              Treasury Capital Utilization
            </span>
            <span className="text-emerald-400 font-bold">
              ₹{remaining.toLocaleString()} available of ₹{budget.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              style={{ width: `${spentPct}%` }}
              className="bg-cyan-500 transition-all duration-500"
              title={`Spent: ₹${spent.toLocaleString()} (${spentPct}%)`}
            />
            <div
              style={{ width: `${remainingPct}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Remaining: ₹${remaining.toLocaleString()} (${remainingPct}%)`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
              <span>Invested: ₹{spent.toLocaleString()} ({spentPct}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Available: ₹{remaining.toLocaleString()} ({remainingPct}%)</span>
            </span>
          </div>
        </div>

        {/* Delegation Roster & Contact Information */}
        <div
          className={`p-6 rounded-2xl border ${
            isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3
                className={`font-['Chakra_Petch'] font-bold text-base uppercase tracking-wider ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                DELEGATION ROSTER &amp; CONTACT
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Registered on {participantTeam.registeredAt}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mb-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Leader Contact: {participantTeam.leaderEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Phone: {participantTeam.leaderPhone}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
              Registered Members:
            </span>
            <div className="flex flex-wrap gap-2">
              {(participantTeam.memberNames || []).map((member, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 ${
                    idx === 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-emerald-500 font-bold">#{idx + 1}</span>
                  <span>{member}</span>
                  {idx === 0 && (
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold ml-1">
                      (Leader)
                    </span>
                  )}
                </span>
              ))}
              {(!participantTeam.memberNames || participantTeam.memberNames.length === 0) && (
                <span className="text-xs text-slate-500 italic">No member names listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Won Civic Resources Showcase */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h3
                className={`font-['Chakra_Petch'] font-black text-xl uppercase tracking-wide ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                WON CIVIC ASSETS ({assets.length})
              </h3>
            </div>

            {Object.keys(categoryCounts).length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <span
                    key={cat}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getCategoryBadge(
                      cat
                    )}`}
                  >
                    {cat}: {count}
                  </span>
                ))}
              </div>
            )}
          </div>

          {assets.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <Briefcase className="w-7 h-7" />
              </div>
              <h4
                className={`font-['Chakra_Petch'] font-bold text-lg uppercase mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                NO CIVIC ASSETS ACQUIRED YET
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-6 font-sans leading-relaxed">
                Your delegation currently has the full green treasury of{' '}
                <strong className="text-emerald-400 font-mono">₹{remaining.toLocaleString()}</strong> ready
                for strategic deployment. Enter the Live Bidding Arena during active rounds to bid on
                vital civic and ecological assets!
              </p>
              {onExploreAuction && (
                <button
                  type="button"
                  onClick={onExploreAuction}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Gavel className="w-4 h-4" />
                  <span>ENTER LIVE BIDDING ARENA</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map((item, idx) => {
                const prize = item.soldPrice || item.startingPrice;
                return (
                  <div
                    key={item.id || idx}
                    className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isDarkMode
                        ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/50'
                        : 'bg-white border-slate-200 hover:border-emerald-500 shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border font-medium ${getCategoryBadge(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Won Asset</span>
                        </span>
                      </div>

                      {/* Resource Name */}
                      <h4
                        className={`font-['Chakra_Petch'] font-bold text-xl uppercase mb-2 ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.name}
                      </h4>

                      {/* Impact / Societal Benefit */}
                      <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4 line-clamp-2">
                        {item.societalBenefit || item.impactDescription}
                      </p>

                      {/* Synergy Tags */}
                      {Array.isArray(item.synergyTags) && item.synergyTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.synergyTags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing and Inspect Action */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="font-mono">
                        <span className="text-[10px] text-slate-500 uppercase block">
                          Winning Prize / Valuation
                        </span>
                        <span className="text-lg font-bold text-emerald-400">
                          ₹{prize.toLocaleString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectResource(item)}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Spec</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Privacy notice banner for participants */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Confidential Team Dossier:</strong> Only members of your delegation can view
              this portfolio. Portfolios belonging to other delegations remain strictly hidden.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 2: GUEST / NOT LOGGED IN
  // Portfolios belonging to teams must remain inaccessible and hidden.
  // ----------------------------------------------------------------------
  if (isGuest) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn">
        <div
          className={`p-8 sm:p-12 rounded-3xl border text-center ${
            isDarkMode
              ? 'bg-[#061810]/80 border-emerald-500/30 text-slate-200'
              : 'bg-white border-emerald-200 text-slate-800 shadow-xl'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-['Space_Mono'] uppercase tracking-wider mb-4 border ${
              isDarkMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>CONFIDENTIAL DELEGATION ACCESS</span>
          </div>

          <h2
            className={`font-['Chakra_Petch'] font-black text-2xl sm:text-3xl uppercase tracking-tight mb-3 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            TEAM PORTFOLIO IS RESTRICTED
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto mb-8 font-sans leading-relaxed">
            In accordance with Green Premier League protocols, each team may only view its own
            portfolio, treasury capital, and acquired civic resources. Portfolios belonging to other
            teams remain strictly confidential and inaccessible.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>SIGN IN TO YOUR TEAM PORTFOLIO</span>
            </button>

            {onOpenRegister && (
              <button
                type="button"
                onClick={onOpenRegister}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                }`}
              >
                REGISTER NEW TEAM
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 3: ADMIN VIEW
  // "DO NOT REVOKE ANY PERMISSIONS OF THE ADMIN IN THIS PROCESS.
  // ADMIN MUST STILL BE ABLE TO VIEW ALL THE PORTFOLIOS"
  // ----------------------------------------------------------------------
  // Filter registered teams by search query for admin oversight
  const filteredTeams = registeredTeams.filter((team) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      team.teamName.toLowerCase().includes(q) ||
      (team.collegeOrDept && team.collegeOrDept.toLowerCase().includes(q)) ||
      team.leaderEmail.toLowerCase().includes(q) ||
      team.id.toLowerCase().includes(q)
    );
  });

  // Selected team metrics for admin inspection modal
  const activeAssets = selectedTeam ? getTeamAssets(selectedTeam) : [];
  const activeBudget = selectedTeam?.fictionalBudget || overallBudget;
  const activeSpent = activeAssets.reduce(
    (sum, item) => sum + (item.soldPrice || item.startingPrice),
    0
  );
  const activeRemaining = Math.max(0, activeBudget - activeSpent);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Admin Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-700/40">
        <div className="max-w-3xl">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Space_Mono'] uppercase tracking-wider mb-3 border ${
              isDarkMode
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                : 'bg-cyan-50 border-cyan-200 text-cyan-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>ADMINISTRATIVE CONSOLE // ALL TEAM PORTFOLIOS</span>
          </div>

          <h2
            className={`font-['Chakra_Petch'] font-black text-3xl sm:text-4xl uppercase tracking-tight mb-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            ALL TEAM ASSET PORTFOLIOS
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Administrative oversight of all participating delegations. Click any team portfolio to
            inspect their enrolled roster, green capital utilization, and complete portfolio of won
            resources.
          </p>
        </div>

        {/* Search Bar & Register CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team, college, or ID..."
              className={`pl-9 pr-4 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors w-full sm:w-64 ${
                isDarkMode
                  ? 'bg-slate-950/80 border-slate-800 text-slate-200 placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>

          {onOpenRegister && (
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>REGISTER TEAM</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Overview Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            REGISTERED PORTFOLIOS
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {registeredTeams.length}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            BASE ALLOCATION
          </span>
          <span className="text-xl font-bold font-mono text-white">
            ₹{overallBudget.toLocaleString()}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            TOTAL CIVIC ASSETS
          </span>
          <span className="text-2xl font-bold font-mono text-cyan-400">
            {auctionItems.length}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            AUCTIONED / CLAIMED
          </span>
          <span className="text-2xl font-bold font-mono text-amber-400">
            {auctionItems.filter((i) => i.status === 'sold').length}
          </span>
        </div>
      </div>

      {/* Admin Clickable Portfolios Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>CLICK ANY TEAM PORTFOLIO TO AUDIT DETAILS &amp; WON RESOURCES</span>
          </span>
          <span className="text-xs font-mono text-slate-500">
            Showing {filteredTeams.length} of {registeredTeams.length} Teams
          </span>
        </div>

        {filteredTeams.length === 0 ? (
          <div
            className={`p-12 rounded-2xl border text-center ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3
              className={`font-['Chakra_Petch'] font-bold text-lg uppercase mb-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {registeredTeams.length === 0
                ? 'NO REGISTERED TEAM PORTFOLIOS YET'
                : 'NO TEAMS MATCHING YOUR SEARCH'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-5 font-sans">
              {registeredTeams.length === 0
                ? 'Register delegations to generate team asset portfolios for the Green Premier League.'
                : 'Try adjusting your search terms or clear the filter to view all team portfolios.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => {
              const assets = getTeamAssets(team);
              const totalValuation = assets.reduce(
                (sum, item) => sum + (item.soldPrice || item.startingPrice),
                0
              );

              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedTeam(team)}
                  className={`group p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
                    isDarkMode
                      ? 'bg-[#090f1d] border-slate-800 hover:border-emerald-500/60 hover:bg-[#0c1427]'
                      : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md'
                  }`}
                >
                  {/* Top Badge Strip */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {team.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                          team.status === 'approved'
                            ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800'
                            : 'text-amber-400 bg-amber-950/40 border border-amber-800'
                        }`}
                      >
                        {team.status || 'Active'}
                      </span>
                    </div>

                    {/* Team Name */}
                    <h3
                      className={`font-['Chakra_Petch'] font-bold text-xl uppercase leading-tight mb-1 group-hover:text-emerald-400 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {team.teamName}
                    </h3>

                    {/* Institution */}
                    <p className="text-xs text-slate-400 font-sans line-clamp-1 mb-4">
                      {team.collegeOrDept || 'Registered Delegation'}
                    </p>
                  </div>

                  {/* Portfolio Highlights */}
                  <div className="pt-3 border-t border-slate-800/60 mt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Resources Won:</span>
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {assets.length} {assets.length === 1 ? 'Resource' : 'Resources'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Portfolio Spend:</span>
                      <span className="font-bold text-white">
                        ₹{totalValuation.toLocaleString()}
                      </span>
                    </div>

                    {/* Click indicator */}
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-emerald-500 font-bold group-hover:translate-x-0.5 transition-transform">
                      <span>Audit Team Portfolio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Detailed Team Portfolio Inspection Modal */}
      {selectedTeam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedTeam(null)}
        >
          <div
            className={`relative w-full max-w-3xl rounded-2xl p-6 sm:p-8 border shadow-2xl my-8 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-[#090f1d] border-emerald-500/40 text-slate-200'
                : 'bg-white border-slate-300 text-slate-800'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Team Details */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-700/50 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    TEAM DOSSIER // {selectedTeam.id}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded uppercase ${
                      selectedTeam.status === 'approved'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-700'
                    }`}
                  >
                    {selectedTeam.status || 'Active'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Registered: {selectedTeam.registeredAt}
                  </span>
                </div>

                <h3
                  className={`font-['Chakra_Petch'] font-black text-2xl sm:text-3xl uppercase tracking-wide ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {selectedTeam.teamName}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-sans mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedTeam.collegeOrDept || 'Independent Delegation'}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Team Contact & Roster Details */}
            <div className="py-4 border-b border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Leader: {selectedTeam.leaderEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Phone: {selectedTeam.leaderPhone}</span>
              </div>

              <div className="sm:col-span-2 pt-2">
                <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="uppercase text-[11px]">Enrolled Team Members:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedTeam.memberNames || []).map((mem, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-xs border ${
                        idx === 0
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                          : isDarkMode
                          ? 'bg-slate-900 border-slate-800 text-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {mem} {idx === 0 ? '(Leader)' : ''}
                    </span>
                  ))}
                  {(!selectedTeam.memberNames || selectedTeam.memberNames.length === 0) && (
                    <span className="text-xs text-slate-500 italic">No members listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Overview Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 my-6 font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block mb-1">TOTAL BUDGET</span>
                <span className="text-base sm:text-lg font-bold text-white">
                  ₹{activeBudget.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block mb-1">INVESTED / SPENT</span>
                <span className="text-base sm:text-lg font-bold text-cyan-400">
                  ₹{activeSpent.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block mb-1">REMAINING FUNDS</span>
                <span className="text-base sm:text-lg font-bold text-emerald-400">
                  ₹{activeRemaining.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Team Portfolio: Resources with categories and prizes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <h4
                    className={`font-['Chakra_Petch'] font-bold text-base uppercase tracking-wider ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    TEAM PORTFOLIO RESOURCES ({activeAssets.length})
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Categories &amp; Prizes
                </span>
              </div>

              {activeAssets.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-slate-400 border border-dashed border-slate-800 rounded-xl space-y-2">
                  <p>No resources acquired yet during the auction.</p>
                  <p className="text-[11px] text-slate-500">
                    When this team wins items on the live auction floor, they appear here with their
                    category and price.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-xl overflow-hidden">
                  {activeAssets.map((item, idx) => {
                    const price = item.soldPrice || item.startingPrice;
                    return (
                      <div
                        key={item.id || idx}
                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isDarkMode
                            ? 'bg-slate-900/40 hover:bg-slate-900/80'
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        {/* Resource Name & Category */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-mono text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-['Chakra_Petch'] font-bold text-base uppercase text-white tracking-wide">
                              {item.name}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border font-medium ${getCategoryBadge(
                                  item.category
                                )}`}
                              >
                                {item.category}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Base: ₹{item.startingPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price / Prize & Inspect */}
                        <div className="sm:text-right font-mono shrink-0 pl-11 sm:pl-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase block">
                              Prize / Valuation
                            </span>
                            <span className="text-base font-extrabold text-emerald-400">
                              ₹{price.toLocaleString()}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onSelectResource(item)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Spec</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="mt-8 pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Administrative audit of {selectedTeam.teamName}
              </span>
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
