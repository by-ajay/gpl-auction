import React, { useState, useEffect } from 'react';
import { AuctionItem, RegisteredTeam } from '../types';
import { getItemBudgetPercentage } from '../data/eventData';
import {
  X,
  Droplets,
  HeartPulse,
  GraduationCap,
  Trash2,
  Bus,
  Sparkles,
  Accessibility,
  Briefcase,
  ShieldAlert,
  Trees,
  Layers,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Tag,
  Info,
  Sun,
  Utensils,
  Home,
  Wifi,
  Shield,
  LockKeyhole,
  BookOpen,
  Baby,
  HeartHandshake,
  Palette,
  FileCheck,
  RefreshCw,
  Wind,
  Scale,
  CloudRain,
  Cpu,
  Wrench,
  ShieldCheck,
  Save,
  Plus,
  BatteryCharging,
  Building,
  Waves,
  Zap,
  ThermometerSnowflake,
  Fish,
  Sprout,
  Footprints,
  PackageOpen,
  Plane,
  Truck,
  Activity,
  Soup,
  Milestone,
  Share2,
  Database,
  Flame,
  SunDim,
  Landmark,
  Atom,
  Scissors,
  Compass,
  Coins,
  Filter,
  Globe,
  Radio,
  Navigation,
  Award,
  Gavel,
  Train,
  Gauge,
  Cable,
  Anchor,
  Mountain,
  LifeBuoy,
  Stethoscope,
  Construction,
  Umbrella,
  Lightbulb,
  Factory,
  Apple,
  Shell,
  Monitor,
  Shirt,
  Laptop,
  Map,
  Bell,
  Search,
  Siren,
} from 'lucide-react';

interface ResourceDetailModalProps {
  item: AuctionItem | null;
  onClose: () => void;
  isDarkMode?: boolean;
  isAdmin?: boolean;
  registeredTeams?: RegisteredTeam[];
  onAssignResource?: (itemId: string, teamName: string, price: number) => void;
  onUnassignResource?: (itemId: string) => void;
  onUpdateStartingPrice?: (itemId: string, newPrice: number) => void;
}

const iconComponentMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  HeartPulse,
  GraduationCap,
  Trash2,
  Bus,
  Sparkles,
  Accessibility,
  Briefcase,
  ShieldAlert,
  Trees,
  Sun,
  Utensils,
  Home,
  Wifi,
  Shield,
  LockKeyhole,
  BookOpen,
  Baby,
  HeartHandshake,
  Palette,
  FileCheck,
  RefreshCw,
  Wind,
  Scale,
  CloudRain,
  Cpu,
  Wrench,
  ShieldCheck,
  BatteryCharging,
  Building,
  Waves,
  Zap,
  ThermometerSnowflake,
  Fish,
  Sprout,
  Footprints,
  PackageOpen,
  Plane,
  Truck,
  Activity,
  Soup,
  Milestone,
  Share2,
  Database,
  Flame,
  SunDim,
  Landmark,
  Atom,
  Scissors,
  Compass,
  Coins,
  Filter,
  Globe,
  Radio,
  Navigation,
  Award,
  Gavel,
  Train,
  Gauge,
  Cable,
  Anchor,
  Mountain,
  LifeBuoy,
  Stethoscope,
  Construction,
  Umbrella,
  Lightbulb,
  Factory,
  Apple,
  Shell,
  Monitor,
  Shirt,
  Laptop,
  Map,
  Bell,
  Search,
  Siren,
};

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  item,
  onClose,
  isDarkMode = true,
  isAdmin = false,
  registeredTeams = [],
  onAssignResource,
  onUnassignResource,
  onUpdateStartingPrice,
}) => {
  const [priceInput, setPriceInput] = useState<number>(item?.startingPrice || 100000);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedTeamForAssign, setSelectedTeamForAssign] = useState<string>(
    registeredTeams[0]?.teamName || ''
  );
  const [assignPrice, setAssignPrice] = useState<number>(item?.startingPrice || 100000);
  const [assignSuccessNotice, setAssignSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setPriceInput(item.startingPrice);
      setAssignPrice(item.soldPrice || item.startingPrice);
    }
  }, [item]);

  useEffect(() => {
    if (!selectedTeamForAssign && registeredTeams.length > 0) {
      setSelectedTeamForAssign(registeredTeams[0].teamName);
    }
  }, [registeredTeams, selectedTeamForAssign]);

  if (!item) return null;

  const Icon = iconComponentMap[item.iconName] || Layers;

  const handleAssignClick = () => {
    if (!selectedTeamForAssign || !onAssignResource) return;
    onAssignResource(item.id, selectedTeamForAssign, Number(assignPrice));
    setAssignSuccessNotice(`Resource assigned to ${selectedTeamForAssign}!`);
    setTimeout(() => setAssignSuccessNotice(null), 2500);
  };

  const handleUnassignClick = () => {
    if (!onUnassignResource) return;
    onUnassignResource(item.id);
    setAssignSuccessNotice('Resource unassigned and restored to available inventory.');
    setTimeout(() => setAssignSuccessNotice(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 border shadow-2xl corner-brackets my-8 ${
          isDarkMode
            ? 'bg-[#04130d] border-emerald-500/40 text-slate-200'
            : 'bg-white border-emerald-200 text-slate-800'
        }`}
      >
        {/* Header / Close button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-lg transition-colors cursor-pointer ${
            isDarkMode
              ? 'bg-emerald-950/40 text-slate-400 hover:text-white hover:bg-emerald-900/50'
              : 'bg-emerald-50 text-slate-500 hover:text-slate-900 hover:bg-emerald-100'
          }`}
          aria-label="Close Resource Details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badge */}
        <div className="flex items-center gap-3 mb-4 text-xs font-['Space_Mono'] text-emerald-400">
          <span className="bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded font-bold uppercase">
            SPECIFICATION SHEET // {item.category}
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">OFFICIAL AUCTION ASSET</span>
        </div>

        {/* Resource Header */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${item.colorAccent}15`,
              borderColor: `${item.colorAccent}50`,
              color: item.colorAccent,
            }}
          >
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h3
              className={`font-['Chakra_Petch'] font-bold text-2xl sm:text-3xl uppercase tracking-wide ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-mono text-slate-400">Budget / Starting Price:</span>
              <span className="font-['Space_Mono'] font-bold text-emerald-400 text-lg">
                ₹{item.startingPrice.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-500/10 font-bold">
                {getItemBudgetPercentage(item.id)}% of Base Budget
              </span>
            </div>
          </div>
        </div>

        {/* Primary Societal Impact */}
        <div
          className={`mb-6 p-4 rounded-xl border ${
            isDarkMode ? 'bg-[#072116] border-emerald-900/50' : 'bg-emerald-50/50 border-emerald-200'
          }`}
        >
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            Core Societal Impact
          </span>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {item.longDescription}
          </p>
        </div>

        {/* Strategic Analysis Grid - Greens & Blues Only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>SOCIETAL BENEFIT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {item.societalBenefit}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-cyan-400" />
              <span>VULNERABILITY IF IGNORED</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {item.riskIfIgnored}
            </p>
          </div>
        </div>

        {/* Synergistic Assets */}
        <div className="mb-6">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Interconnected Sectors & Synergies:
          </span>
          <div className="flex flex-wrap gap-2">
            {item.synergyTags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-mono px-3 py-1 rounded border flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'bg-emerald-950/30 border-emerald-900/50 text-slate-300'
                    : 'bg-white border-emerald-200 text-slate-700'
                }`}
              >
                <Tag className="w-3 h-3 text-emerald-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Admin Exclusive Resource Assignment & Budget Controls */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/25">
            <div className="flex items-center gap-2 mb-3">
              <Gavel className="w-4 h-4 text-emerald-400" />
              <span className="font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider text-emerald-300">
                ADMIN RESOURCE ASSIGNMENT CONTROLS
              </span>
            </div>

            {assignSuccessNotice && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{assignSuccessNotice}</span>
              </div>
            )}

            {item.status === 'sold' ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#02140b] border border-emerald-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">CURRENT ASSIGNMENT:</span>
                  <p className="text-sm font-['Chakra_Petch'] font-bold text-white">
                    Assigned to <span className="text-emerald-400">{item.soldToTeam}</span> at ₹{item.soldPrice?.toLocaleString()}
                  </p>
                </div>
                {onUnassignResource && (
                  <button
                    type="button"
                    onClick={handleUnassignClick}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    REVOKE / UNASSIGN
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-[11px] font-mono text-slate-400 block">
                  Directly assign this asset to any registered team (strictly restricted to administrators):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Target Registered Team:
                    </label>
                    <select
                      value={selectedTeamForAssign}
                      onChange={(e) => setSelectedTeamForAssign(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none cursor-pointer ${
                        isDarkMode ? 'bg-[#02180e] border-emerald-800 text-white' : 'bg-white border-emerald-300 text-slate-900'
                      }`}
                    >
                      {registeredTeams.map((t) => (
                        <option key={t.id} value={t.teamName}>
                          {t.teamName} ({t.leaderEmail})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Assigned Price (₹):
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={assignPrice || ''}
                      onChange={(e) => setAssignPrice(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none ${
                        isDarkMode ? 'bg-[#02180e] border-emerald-800 text-white' : 'bg-white border-emerald-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAssignClick}
                    disabled={!selectedTeamForAssign}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    <span>ASSIGN RESOURCE TO TEAM</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-4 border-t border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
            {item.status === 'sold' ? (
              <span className="text-cyan-400 font-bold">
                Exclusively acquired by {item.soldToTeam}.
              </span>
            ) : (
              <span>Exclusive resource subject to official admin assignment or live auction floor.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-xs font-mono border cursor-pointer ${
                isDarkMode
                  ? 'bg-emerald-950/30 hover:bg-emerald-900/40 text-slate-300 border-emerald-900/50'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border-emerald-200'
              }`}
            >
              CLOSE
            </button>

            {/* Admin can edit the budget of the resource */}
            {isAdmin && onUpdateStartingPrice && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 border rounded-lg px-2.5 py-1.5 ${
                  isDarkMode ? 'bg-[#020b06] border-emerald-900/60' : 'bg-white border-emerald-200'
                }`}>
                  <span className="text-xs font-mono text-slate-400">₹</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={priceInput}
                    onChange={(e) => setPriceInput(Number(e.target.value))}
                    className="w-28 bg-transparent text-xs font-mono text-emerald-400 font-bold outline-none"
                    placeholder="New budget"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (priceInput > 0) {
                      onUpdateStartingPrice(item.id, priceInput);
                      setSavedSuccess(true);
                      setTimeout(() => setSavedSuccess(false), 2000);
                    }
                  }}
                  className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'SAVED' : 'SAVE BUDGET'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
