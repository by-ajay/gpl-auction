import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
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
  onSimulateBid?: (item: AuctionItem) => void;
  isDrafted?: boolean;
  canAfford?: boolean;
  isDarkMode?: boolean;
  isAdmin?: boolean;
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
  onSimulateBid,
  isDrafted,
  canAfford,
  isDarkMode = true,
  isAdmin = false,
  onUpdateStartingPrice,
}) => {
  const [priceInput, setPriceInput] = useState<number>(item?.startingPrice || 100000);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (item) {
      setPriceInput(item.startingPrice);
    }
  }, [item]);

  if (!item) return null;

  const Icon = iconComponentMap[item.iconName] || Layers;

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

        {/* Action Footer */}
        <div className="pt-4 border-t border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
            <span>Exclusive resource subject to official auction bidding.</span>
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

            {/* Admin can edit the budget of the resource, but cannot add resources to their own team */}
            {isAdmin && onUpdateStartingPrice ? (
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
            ) : onSimulateBid ? (
              <button
                type="button"
                onClick={() => {
                  onSimulateBid(item);
                  onClose();
                }}
                className={`px-5 py-2 rounded-lg text-xs font-['Chakra_Petch'] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isDrafted
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    : canAfford
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isDrafted ? (
                  <span>REMOVE RESOURCE</span>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD RESOURCE</span>
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
