import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Search,
  Download,
  ShieldCheck,
  Lock,
  Wallet,
  Building2,
  Users,
  Layers,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ArrowUpDown,
  FileSpreadsheet,
  Leaf,
} from 'lucide-react';
import { RegisteredTeam, AuctionItem, UserSession, LeaderboardEntry } from '../types';

interface LeaderboardSectionProps {
  registeredTeams: RegisteredTeam[];
  auctionItems: AuctionItem[];
  overallBudget: number;
  userSession: UserSession;
  onOpenLogin: () => void;
  onSelectResource: (item: AuctionItem) => void;
  isDarkMode: boolean;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  registeredTeams,
  auctionItems,
  overallBudget,
  userSession,
  onOpenLogin,
  onSelectResource,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamForAudit, setSelectedTeamForAudit] = useState<LeaderboardEntry | null>(null);

  // Compute leaderboard ranking based on total base price of acquired resources
  const leaderboardData: LeaderboardEntry[] = useMemo(() => {
    const entries = registeredTeams.map((team) => {
      // Find all items won exclusively by this team in auction
      const acquiredItems = auctionItems.filter(
        (item) =>
          item.status === 'sold' &&
          Boolean(item.soldToTeam) &&
          item.soldToTeam?.toLowerCase() === team.teamName.toLowerCase()
      );

      // Total portfolio value based strictly on the base price of acquired resources
      const totalBaseValue = acquiredItems.reduce((sum, item) => sum + item.startingPrice, 0);

      // Total amount actually committed/spent
      const totalSpent = acquiredItems.reduce(
        (sum, item) => sum + (item.soldPrice ?? item.startingPrice),
        0
      );

      const teamBudget = team.fictionalBudget || overallBudget;
      const remainingBudget = Math.max(0, teamBudget - totalSpent);

      return {
        rank: 0,
        teamId: team.id,
        teamName: team.teamName,
        collegeOrDept: team.collegeOrDept,
        leaderEmail: team.leaderEmail,
        memberCount: team.memberNames?.length || 0,
        acquiredItems,
        totalBaseValue,
        totalSpent,
        remainingBudget,
        fictionalBudget: teamBudget,
      };
    });

    // Sort descending by totalBaseValue; secondary sort by remainingBudget
    entries.sort((a, b) => {
      if (b.totalBaseValue !== a.totalBaseValue) {
        return b.totalBaseValue - a.totalBaseValue;
      }
      return b.remainingBudget - a.remainingBudget;
    });

    // Assign 1-indexed ranks (handling ties if necessary)
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [registeredTeams, auctionItems, overallBudget]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return leaderboardData;
    const q = searchQuery.toLowerCase();
    return leaderboardData.filter(
      (e) =>
        e.teamName.toLowerCase().includes(q) ||
        (e.collegeOrDept && e.collegeOrDept.toLowerCase().includes(q)) ||
        e.leaderEmail.toLowerCase().includes(q)
    );
  }, [leaderboardData, searchQuery]);

  // Overall event metrics
  const totalSoldAssets = auctionItems.filter((i) => i.status === 'sold').length;
  const topBaseValue = leaderboardData.length > 0 ? leaderboardData[0].totalBaseValue : 0;
  const avgBaseValue =
    leaderboardData.length > 0
      ? Math.round(
          leaderboardData.reduce((acc, curr) => acc + curr.totalBaseValue, 0) /
            leaderboardData.length
        )
      : 0;

  // Export CSV function for event organizers
  const handleExportCSV = () => {
    if (leaderboardData.length === 0) return;

    const headers = [
      'Rank',
      'Team Name',
      'College/Department',
      'Leader Email',
      'Acquired Count',
      'Portfolio Base Value (INR)',
      'Total Spent (INR)',
      'Remaining Treasury (INR)',
      'Initial Budget (INR)',
      'Acquired Resource Names',
    ];

    const rows = leaderboardData.map((e) => [
      e.rank,
      `"${e.teamName}"`,
      `"${e.collegeOrDept || 'N/A'}"`,
      `"${e.leaderEmail}"`,
      e.acquiredItems.length,
      e.totalBaseValue,
      e.totalSpent,
      e.remainingBudget,
      e.fictionalBudget,
      `"${e.acquiredItems.map((i) => i.name).join('; ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `green_premier_auction_leaderboard_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ADMIN SECURITY GATE:
  // If not logged in as admin, show clean authorized access gate
  if (userSession.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div
          className={`p-10 sm:p-14 rounded-3xl border shadow-2xl relative overflow-hidden ${
            isDarkMode
              ? 'bg-[#04130d] border-cyan-500/40 text-slate-200'
              : 'bg-white border-cyan-300 text-slate-800'
          }`}
        >
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/15 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-6">
            <Lock className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-4 border bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RESTRICTED ORGANIZER ACCESS</span>
          </div>

          <h2
            className={`font-['Chakra_Petch'] font-black text-3xl sm:text-4xl uppercase mb-3 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            ADMINISTRATIVE LEADERBOARD
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto font-sans leading-relaxed mb-8">
            The event leaderboard ranks teams by their total portfolio value based on the base price
            of acquired resources. To prevent premature competitive bias, access is restricted to
            authorized event administrators.
          </p>

          <button
            type="button"
            onClick={onOpenLogin}
            className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>SIGN IN AS EVENT ADMINISTRATOR</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-emerald-950/60">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Space_Mono'] uppercase tracking-wider border ${
                isDarkMode
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMINISTRATIVE PORTFOLIO RANKINGS</span>
            </div>
          </div>

          <h1
            className={`font-['Chakra_Petch'] font-extrabold text-3xl sm:text-5xl uppercase tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            OFFICIAL TEAM LEADERBOARD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl leading-relaxed">
            Teams ranked by total portfolio value calculated using the base price of their acquired
            civic resources. Reflects societal impact capital deployment from the allocated ₹
            {overallBudget.toLocaleString()} budget.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {leaderboardData.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm ${
                isDarkMode
                  ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-400 hover:bg-slate-800'
                  : 'bg-white border-emerald-600/40 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>EXPORT LEADERBOARD CSV</span>
            </button>
          )}

          <div
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 text-xs font-mono ${
              isDarkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span>
              BASE BUDGET: <strong className="text-emerald-500">₹{overallBudget.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900/60 border-slate-800/80 shadow-md'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              TEAMS ENROLLED
            </span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div
            className={`font-['Space_Mono'] font-extrabold text-3xl ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {registeredTeams.length}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Official event competitors</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900/60 border-slate-800/80 shadow-md'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              ASSETS AUCTIONED
            </span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-['Space_Mono'] font-extrabold text-3xl text-emerald-500">
            {totalSoldAssets}{' '}
            <span className="text-sm font-normal text-slate-400">/ {auctionItems.length}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Single-buyer exclusivity locked</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900/60 border-slate-800/80 shadow-md'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              PEAK PORTFOLIO VALUE
            </span>
            <Crown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-['Space_Mono'] font-extrabold text-3xl text-emerald-400">
            ₹{topBaseValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Highest cumulative base price</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900/60 border-slate-800/80 shadow-md'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              AVERAGE BASE VALUE
            </span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div
            className={`font-['Space_Mono'] font-extrabold text-3xl ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            ₹{avgBaseValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Across all participating teams</span>
        </div>
      </div>

      {/* Podium Highlight (Top 3 Teams) */}
      {leaderboardData.length > 0 && leaderboardData.some((e) => e.totalBaseValue > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <h3
              className={`font-['Chakra_Petch'] font-bold text-xl uppercase tracking-wide ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              PODIUM LEADERS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboardData.slice(0, 3).map((entry, idx) => {
              const medalColors = [
                {
                  border: 'border-emerald-500/60',
                  bg: isDarkMode ? 'bg-emerald-950/20' : 'bg-emerald-50',
                  badge: 'bg-emerald-500 text-slate-950 font-bold',
                  text: 'text-emerald-400',
                  label: '1ST PLACE // TOP IMPACT',
                  icon: Crown,
                },
                {
                  border: 'border-cyan-500/60',
                  bg: isDarkMode ? 'bg-cyan-950/20' : 'bg-cyan-50',
                  badge: 'bg-cyan-500 text-slate-950 font-bold',
                  text: 'text-cyan-400',
                  label: '2ND PLACE // EXCELLENCE',
                  icon: Medal,
                },
                {
                  border: 'border-sky-500/60',
                  bg: isDarkMode ? 'bg-sky-950/20' : 'bg-sky-50',
                  badge: 'bg-sky-500 text-slate-950 font-bold',
                  text: 'text-sky-400',
                  label: '3RD PLACE // DISTINCTION',
                  icon: Award,
                },
              ][idx];

              const Icon = medalColors.icon;

              return (
                <div
                  key={entry.teamId}
                  className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${medalColors.border} ${medalColors.bg} shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${medalColors.badge}`}
                    >
                      {medalColors.label}
                    </span>
                    <Icon className={`w-6 h-6 ${medalColors.text}`} />
                  </div>

                  <h4
                    className={`font-['Chakra_Petch'] font-bold text-xl uppercase truncate mb-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {entry.teamName}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans truncate mb-4">
                    {entry.collegeOrDept || 'Registered Delegation'}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-700/40 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Portfolio Base Value:</span>
                      <span className={`font-bold text-base ${medalColors.text}`}>
                        ₹{entry.totalBaseValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Assets Acquired:</span>
                      <span className="font-bold text-emerald-400">
                        {entry.acquiredItems.length} items
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Remaining Treasury:</span>
                      <span className="text-slate-300">
                        ₹{entry.remainingBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTeamForAudit(entry)}
                    className="w-full mt-5 py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-xs font-mono font-bold text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Audit Team Portfolio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Ranking Table Card */}
      <div
        className={`rounded-2xl border shadow-xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
        }`}
      >
        {/* Table Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-700/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team or department..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-500 ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 self-end sm:self-center">
            Showing <strong className="text-emerald-500">{filteredEntries.length}</strong> of{' '}
            {leaderboardData.length} Teams
          </div>
        </div>

        {/* Table Body */}
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs space-y-2">
            <p>No teams matching search query or registered in the database.</p>
            <p className="text-[11px] text-slate-600">
              When teams enroll and acquire assets on the live auction floor, their ranking will
              appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead
                className={`font-['Space_Mono'] uppercase text-[11px] border-b ${
                  isDarkMode
                    ? 'bg-slate-950/90 border-slate-800 text-slate-400'
                    : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}
              >
                <tr>
                  <th className="p-4 w-16 text-center">Rank</th>
                  <th className="p-4">Team & Institution</th>
                  <th className="p-4 text-right">
                    <span className="text-emerald-500 font-bold">Portfolio Base Value</span>
                  </th>
                  <th className="p-4 text-right">Actual Spend</th>
                  <th className="p-4 text-right">Remaining Fund</th>
                  <th className="p-4 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredEntries.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  const rankBadgeClass =
                    entry.rank === 1
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : entry.rank === 2
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : entry.rank === 3
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400';

                  return (
                    <tr
                      key={entry.teamId}
                      className={`transition-colors ${
                        isDarkMode
                          ? 'hover:bg-slate-800/50'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Rank */}
                      <td className="p-4 text-center">
                        <span
                          className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs shadow-sm ${rankBadgeClass}`}
                        >
                          {entry.rank}
                        </span>
                      </td>

                      {/* Team & Institution */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => setSelectedTeamForAudit(entry)}
                          className="font-['Chakra_Petch'] font-bold text-sm uppercase text-slate-100 hover:text-emerald-400 text-left transition-colors cursor-pointer block"
                        >
                          {entry.teamName}
                        </button>
                        <div className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{entry.collegeOrDept || 'Independent Delegation'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Lead: {entry.leaderEmail} • {entry.memberCount} Members
                        </div>
                      </td>

                      {/* Total Portfolio Base Value */}
                      <td className="p-4 text-right">
                        <div className="text-base font-extrabold text-emerald-400">
                          ₹{entry.totalBaseValue.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {entry.acquiredItems.length} items base sum
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="p-4 text-right">
                        <div className="text-xs font-bold text-slate-300">
                          ₹{entry.totalSpent.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-500">Hammer bids</span>
                      </td>

                      {/* Remaining Budget */}
                      <td className="p-4 text-right">
                        <div className="text-xs font-bold text-sky-400">
                          ₹{entry.remainingBudget.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          / ₹{entry.fictionalBudget.toLocaleString()}
                        </span>
                      </td>

                      {/* Audit Action Button */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedTeamForAudit(entry)}
                          className={`p-2 rounded-lg border transition-colors ${
                            isDarkMode
                              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                          }`}
                          title="Open Comprehensive Portfolio Audit"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Team Portfolio Audit Modal */}
      {selectedTeamForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div
            className={`relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 border shadow-2xl my-8 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-[#090f1d] border-emerald-500/50 text-slate-200'
                : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-6">
              <div>
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider block">
                  TEAM PORTFOLIO AUDIT // RANK #{selectedTeamForAudit.rank}
                </span>
                <h3
                  className={`font-['Chakra_Petch'] font-bold text-2xl uppercase ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {selectedTeamForAudit.teamName}
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  {selectedTeamForAudit.collegeOrDept || 'Independent Delegation'} • Contact:{' '}
                  {selectedTeamForAudit.leaderEmail}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeamForAudit(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 mb-6 font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Base Value</span>
                <span className="text-emerald-400 font-bold text-lg">
                  ₹{selectedTeamForAudit.totalBaseValue.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Auction Spend</span>
                <span className="text-slate-200 font-bold text-lg">
                  ₹{selectedTeamForAudit.totalSpent.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Remaining Fund</span>
                <span className="text-sky-400 font-bold text-lg">
                  ₹{selectedTeamForAudit.remainingBudget.toLocaleString()}
                </span>
              </div>
            </div>

            {/* List of Acquired Assets */}
            <div className="space-y-3">
              <h4
                className={`font-['Chakra_Petch'] font-bold text-sm uppercase ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Acquired Assets ({selectedTeamForAudit.acquiredItems.length}):
              </h4>

              {selectedTeamForAudit.acquiredItems.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No assets secured during the live auction yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedTeamForAudit.acquiredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                        isDarkMode
                          ? 'bg-slate-900/70 border-slate-800'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTeamForAudit(null);
                              onSelectResource(item);
                            }}
                            className="font-['Chakra_Petch'] font-bold text-sm uppercase text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <span>{item.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </button>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono">
                        <div className="text-xs font-bold text-emerald-400">
                          Base: ₹{item.startingPrice.toLocaleString()}
                        </div>
                        {item.soldPrice && (
                          <div className="text-[10px] text-slate-500">
                            Won at: ₹{item.soldPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTeamForAudit(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
