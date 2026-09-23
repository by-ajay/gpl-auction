import React, { useState } from 'react';
import { RegisteredTeam, AuctionItem } from '../types';
import {
  ShieldCheck,
  Users,
  Gavel,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  Plus,
  DollarSign,
  Wallet,
  Save,
  Edit3,
  Layers,
  Leaf,
  Trash2,
  RefreshCw,
  Upload,
  FileJson,
} from 'lucide-react';
import { calculateScaledItemPrice, getItemBudgetPercentage } from '../data/eventData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail?: string;
  registeredTeams: RegisteredTeam[];
  auctionItems: AuctionItem[];
  overallBudget: number;
  onUpdateOverallBudget: (newBudget: number) => void;
  onUpdateItemStatus: (itemId: string, status: 'available' | 'sold', teamName?: string, price?: number) => void;
  onUpdateItemStartingPrice?: (itemId: string, newPrice: number) => void;
  onToggleTeamStatus?: (teamId: string) => void;
  onDeleteTeam?: (teamId: string) => void;
  onResetAuction?: () => void;
  onRefreshTeams?: () => void;
  onImportTeams?: (teams: RegisteredTeam[]) => void;
  isDarkMode: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  adminEmail,
  registeredTeams,
  auctionItems,
  overallBudget,
  onUpdateOverallBudget,
  onUpdateItemStatus,
  onUpdateItemStartingPrice,
  onToggleTeamStatus,
  onDeleteTeam,
  onResetAuction,
  onRefreshTeams,
  onImportTeams,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'auction' | 'budget' | 'resources'>('teams');
  const [selectedItemForSale, setSelectedItemForSale] = useState<string>('');
  const [soldTeam, setSoldTeam] = useState<string>('');
  const [soldPrice, setSoldPrice] = useState<number>(10000);
  const [budgetInput, setBudgetInput] = useState<number>(overallBudget);
  const [budgetSavedNotice, setBudgetSavedNotice] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newLeaderEmail, setNewLeaderEmail] = useState('');
  const [newLeaderPhone, setNewLeaderPhone] = useState('');
  const [newDept, setNewDept] = useState('');

  // Individual resource budget edit state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemPrice, setEditingItemPrice] = useState<number>(0);
  const [resourceSavedNotice, setResourceSavedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMarkSold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForSale || !soldTeam) return;
    onUpdateItemStatus(selectedItemForSale, 'sold', soldTeam, Number(soldPrice));
    setSelectedItemForSale('');
    setSoldTeam('');
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (budgetInput > 0) {
      onUpdateOverallBudget(budgetInput);
      setBudgetSavedNotice(true);
      setTimeout(() => setBudgetSavedNotice(false), 2500);
    }
  };

  const handleSaveIndividualResourceBudget = (itemId: string) => {
    if (onUpdateItemStartingPrice && editingItemPrice > 0) {
      onUpdateItemStartingPrice(itemId, editingItemPrice);
      setResourceSavedNotice(itemId);
      setTimeout(() => {
        setResourceSavedNotice(null);
        setEditingItemId(null);
      }, 1500);
    }
  };

  const exportTeamsToCSV = () => {
    const headers = ['Team ID', 'Team Name', 'Leader Email', 'Leader Phone', 'Members', 'Registered At'];
    const rows = registeredTeams.map((t) => [
      t.id,
      `"${t.teamName}"`,
      t.leaderEmail,
      `"${t.leaderPhone}"`,
      `"${t.memberNames.join('; ')}"`,
      t.registeredAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'green_premier_auction_registered_teams.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTeamsToJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(registeredTeams, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'registered_teams.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          if (onImportTeams) {
            onImportTeams(parsed);
          }
          if (onRefreshTeams) {
            setTimeout(onRefreshTeams, 200);
          }
        }
      } catch (err) {
        console.error('Invalid JSON file:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const soldCount = auctionItems.filter((i) => i.status === 'sold').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-4xl rounded-2xl p-6 sm:p-8 border shadow-2xl my-8 max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? 'bg-[#04140d] border-emerald-500/50 text-slate-200'
            : 'bg-white border-emerald-300 text-slate-800'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors cursor-pointer active:scale-95 ${
            isDarkMode
              ? 'bg-emerald-950/60 text-slate-400 hover:text-white border border-emerald-900'
              : 'bg-emerald-50 text-slate-500 hover:text-slate-800 border border-emerald-200'
          }`}
          aria-label="Close Admin Panel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with NSS Logo */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
          <div className="flex items-center gap-3">
            <img
              src="/nss-logo.svg"
              alt="NSS Logo"
              className="w-10 h-10 object-contain rounded-full shadow-md border border-emerald-500/40 shrink-0"
            />
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                GREEN PREMIER LEAGUE // ORGANIZER CONTROL MATRIX
              </span>
              <h3
                className={`font-['Chakra_Petch'] font-black text-2xl uppercase ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                ADMIN EXECUTIVE CONSOLE
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('teams')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'teams'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-900'
              }`}
            >
              Teams ({registeredTeams.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('budget')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'budget'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-900'
              }`}
            >
              Base Budget (₹{overallBudget.toLocaleString()})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'resources'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-900'
              }`}
            >
              Resource Budgets ({auctionItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('auction')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'auction'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-900'
              }`}
            >
              Sales Floor ({soldCount}/{auctionItems.length})
            </button>
          </div>
        </div>

        {/* Note on Admin Privileges */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Organizer Rules Enforced:</strong> Admin accounts do not possess a team portfolio and cannot add resources to their own team. You can view all resources, configure base budgets, and edit individual resource valuations.
            </span>
          </div>
        </div>

        {/* Tab 1: Teams Management */}
        {activeTab === 'teams' && (
          <div className="pt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 font-mono">
                  Total Teams Enrolled: <span className="text-emerald-400 font-bold text-sm">{registeredTeams.length}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRefreshing(true);
                    if (onRefreshTeams) onRefreshTeams();
                    setTimeout(() => setIsRefreshing(false), 500);
                  }}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{isRefreshing ? 'Syncing...' : 'Sync Roster'}</span>
                </button>

                {registeredTeams.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={exportTeamsToJSON}
                      title="Download registered_teams.json to backup or commit to GitHub"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                      <span>Export JSON</span>
                    </button>
                    <button
                      type="button"
                      onClick={exportTeamsToCSV}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                  </>
                )}

                <label
                  title="Import registered teams from a JSON file"
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {registeredTeams.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-emerald-900 rounded-xl text-xs font-mono text-slate-500 space-y-3">
                <p>No teams registered yet. Teams can enroll via the registration form.</p>
                <button
                  type="button"
                  onClick={() => {
                    if (onRefreshTeams) onRefreshTeams();
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Storage for Enrolled Teams</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-emerald-950">
                <table className="w-full text-left text-xs font-sans">
                  <thead
                    className={`font-mono uppercase text-[11px] border-b ${
                      isDarkMode
                        ? 'bg-[#02180e] border-emerald-950 text-slate-400'
                        : 'bg-emerald-50 border-emerald-200 text-slate-700'
                    }`}
                  >
                    <tr>
                      <th className="p-3">Team Name & ID</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3">Leader Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Dept / College</th>
                      <th className="p-3">Members</th>
                      <th className="p-3">Registered</th>
                      {onDeleteTeam && <th className="p-3 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/60">
                    {registeredTeams.map((team) => (
                      <tr
                        key={team.id}
                        className="hover:bg-emerald-500/5 transition-colors"
                      >
                        <td className="p-3">
                          <span className="font-['Chakra_Petch'] font-bold text-sm block text-white">
                            {team.teamName}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">{team.id}</span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => onToggleTeamStatus && onToggleTeamStatus(team.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border cursor-pointer ${
                              team.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                            }`}
                          >
                            {team.status || 'approved'}
                          </button>
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-bold whitespace-nowrap">
                          ₹{(team.fictionalBudget || overallBudget).toLocaleString()}
                        </td>
                        <td className="p-3 font-mono text-slate-300">{team.leaderEmail}</td>
                        <td className="p-3 font-mono text-slate-300 whitespace-nowrap">{team.leaderPhone}</td>
                        <td className="p-3 font-sans text-slate-400 text-[11px] max-w-[140px] truncate" title={team.collegeOrDept}>
                          {team.collegeOrDept || 'College / Department'}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {(team.memberNames || []).map((m, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-900 text-[10px] text-slate-300"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">{team.registeredAt}</td>
                        {onDeleteTeam && (
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => onDeleteTeam(team.id)}
                              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Change Overall Base Budget */}
        {activeTab === 'budget' && (
          <div className="pt-6 space-y-6">
            <div
              className={`p-6 rounded-2xl border ${
                isDarkMode ? 'bg-[#02180e] border-emerald-900' : 'bg-emerald-50/50 border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4
                    className={`font-['Chakra_Petch'] font-bold text-lg uppercase ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    CONFIGURE EVENT BASE BUDGET
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">
                    Change the standard base budget allocated to each participating team (Default: ₹10,00,000 / 10 Lakhs). All team allocations update automatically.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveBudget} noValidate className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">
                    Overall Base Budget Amount (₹)
                  </label>
                  <div className="relative max-w-sm">
                    <span className="absolute left-3.5 top-2.5 text-xs font-mono text-emerald-400">₹</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={budgetInput || ''}
                      onChange={(e) => setBudgetInput(e.target.value === '' ? 0 : Number(e.target.value))}
                      className={`w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-mono font-bold border focus:outline-none focus:border-emerald-400 ${
                        isDarkMode ? 'bg-[#031d12] border-emerald-800 text-white' : 'bg-white border-emerald-300'
                      }`}
                      placeholder="e.g. 1000000"
                    />
                  </div>
                </div>

                {/* Quick Presets for 10 Lakhs Scale */}
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                    Quick Budget Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[500000, 750000, 1000000, 1250000, 1500000, 2000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBudgetInput(preset)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                          budgetInput === preset
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                            : 'bg-emerald-950/60 border-emerald-900 text-slate-300 hover:text-white'
                        }`}
                      >
                        ₹{(preset / 100000).toFixed(preset % 100000 === 0 ? 0 : 1)} Lakh{preset >= 200000 ? 's' : ''} (₹{preset.toLocaleString()})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>APPLY BUDGET TO ALL TEAMS</span>
                  </button>

                  {budgetSavedNotice && (
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Updated overall base budget to ₹{overallBudget.toLocaleString()}!</span>
                    </span>
                  )}
                </div>

                {/* Dynamic Resource Price Scaling Preview */}
                <div className="mt-6 pt-6 border-t border-emerald-950">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h5
                      className={`font-['Chakra_Petch'] font-bold text-sm uppercase ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                      }`}
                    >
                      RESOURCE PRICE PREVIEW (AT ₹{budgetInput.toLocaleString()})
                    </h5>
                    <span className="text-[11px] font-mono text-slate-400">
                      Standard scale across 28 auction items
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {auctionItems.map((item) => {
                      const pct = item.percentage ?? getItemBudgetPercentage(item.id);
                      const scaledPrice = Math.round((budgetInput * pct) / 100);
                      return (
                        <div
                          key={item.id}
                          className={`p-2 rounded-lg border text-xs font-mono ${
                            isDarkMode
                              ? 'bg-[#031d12] border-emerald-950'
                              : 'bg-white border-emerald-200'
                          }`}
                        >
                          <div className="truncate font-bold text-slate-200">{item.name}</div>
                          <div className="flex justify-between items-center mt-1 text-[11px]">
                            <span className="text-emerald-400 font-bold">
                              ₹{scaledPrice.toLocaleString()}
                            </span>
                            <span className="text-slate-400">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Dedicated Resource Budget & Valuation Management */}
        {activeTab === 'resources' && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className={`font-['Chakra_Petch'] font-bold text-base uppercase ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  EDIT INDIVIDUAL RESOURCE VALUATIONS & BUDGETS
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Admins can view each resource and edit its base budget starting price directly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {auctionItems.map((item) => {
                const isEditing = editingItemId === item.id;
                const isSaved = resourceSavedNotice === item.id;
                const pct = getItemBudgetPercentage(item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 ${
                      isDarkMode
                        ? 'bg-[#02180e] border-emerald-900/80 hover:border-emerald-500/50'
                        : 'bg-white border-emerald-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="text-emerald-400 font-bold uppercase">{item.category}</span>
                        <span className="text-cyan-400 font-mono">
                          {item.status === 'sold' ? `SOLD (${item.soldToTeam})` : 'AVAILABLE'}
                        </span>
                      </div>
                      <h5 className="font-['Chakra_Petch'] font-bold text-sm text-white">{item.name}</h5>
                      <p className="text-xs text-slate-400 font-sans line-clamp-2 mt-1">
                        {item.impactDescription}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-emerald-950 flex items-center justify-between gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1.5 text-xs font-mono text-emerald-400">₹</span>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              value={editingItemPrice || ''}
                              onChange={(e) => setEditingItemPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                              className="w-full pl-6 pr-2 py-1 rounded-lg text-xs font-mono bg-[#031d12] border border-emerald-500 text-white outline-none"
                              autoFocus
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSaveIndividualResourceBudget(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingItemId(null)}
                            className="px-2 py-1 rounded-lg bg-emerald-950 text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs font-mono">
                            <span className="text-slate-400">Budget: </span>
                            <span className="font-bold text-emerald-400">₹{item.startingPrice.toLocaleString()}</span>
                            <span className="text-slate-500 text-[10px] ml-1.5">({pct}% base)</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSaved ? (
                              <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Updated!</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setEditingItemPrice(item.startingPrice);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 text-xs font-mono flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit Budget</span>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Inventory & Sale Management */}
        {activeTab === 'auction' && (
          <div className="pt-6 space-y-6">
            {/* Record Winning Hammer Form */}
            <form
              onSubmit={handleMarkSold}
              className={`p-5 rounded-xl border ${
                isDarkMode ? 'bg-[#02180e] border-emerald-900' : 'bg-emerald-50/50 border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Gavel className="w-4 h-4 text-emerald-400" />
                <span className="font-['Chakra_Petch'] font-bold text-sm uppercase text-white">
                  RECORD EXCLUSIVE RESOURCE SALE (HAMMER DOWN)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Select Resource
                  </label>
                  <select
                    value={selectedItemForSale}
                    onChange={(e) => {
                      setSelectedItemForSale(e.target.value);
                      const it = auctionItems.find((i) => i.id === e.target.value);
                      if (it) setSoldPrice(it.startingPrice);
                    }}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-mono outline-none cursor-pointer ${
                      isDarkMode ? 'bg-[#031d12] border-emerald-800 text-white' : 'bg-white border-emerald-300 text-slate-900'
                    }`}
                  >
                    <option value="">-- Choose from 28 Items --</option>
                    {auctionItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.status === 'sold' ? `(SOLD to ${item.soldToTeam})` : `(Base: ₹${item.startingPrice.toLocaleString()})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Winning Team Name
                  </label>
                  {registeredTeams.length > 0 ? (
                    <select
                      value={soldTeam}
                      onChange={(e) => setSoldTeam(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-mono outline-none cursor-pointer ${
                        isDarkMode ? 'bg-[#031d12] border-emerald-800 text-white' : 'bg-white border-emerald-300 text-slate-900'
                      }`}
                    >
                      <option value="">-- Select Registered Team --</option>
                      {registeredTeams.map((t) => (
                        <option key={t.id} value={t.teamName}>
                          {t.teamName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Green Pioneers"
                      value={soldTeam}
                      onChange={(e) => setSoldTeam(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${
                        isDarkMode ? 'bg-[#031d12] border-emerald-800 text-white' : 'bg-white border-emerald-300 text-slate-900'
                      }`}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Winning Bid Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={soldPrice || ''}
                    onChange={(e) => setSoldPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-mono outline-none ${
                      isDarkMode ? 'bg-[#031d12] border-emerald-800 text-white' : 'bg-white border-emerald-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Resource exclusivity: Each resource can strictly only be bought by one team.
                </span>
                <button
                  type="submit"
                  disabled={!selectedItemForSale || !soldTeam}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase disabled:opacity-50 cursor-pointer"
                >
                  CONFIRM EXCLUSIVE SALE
                </button>
              </div>
            </form>

            {/* Inventory Status Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-['Chakra_Petch'] font-bold text-sm uppercase text-slate-300">
                  AUCTION INVENTORY STATUS ({auctionItems.length} ITEMS TOTAL)
                </h4>
                {onResetAuction && (
                  <button
                    type="button"
                    onClick={onResetAuction}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All Sold Items</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {auctionItems.map((item) => {
                  const isSold = item.status === 'sold';
                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        isSold
                          ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                          : 'bg-[#02180e] border-emerald-950 text-slate-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold block font-['Chakra_Petch']">{item.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {isSold ? `Sold to: ${item.soldToTeam} (₹${item.soldPrice?.toLocaleString()})` : `Base: ₹${item.startingPrice.toLocaleString()}`}
                        </span>
                      </div>
                      {isSold ? (
                        <button
                          type="button"
                          onClick={() => onUpdateItemStatus(item.id, 'available')}
                          className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono hover:bg-cyan-500/30 cursor-pointer"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">AVAILABLE</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
