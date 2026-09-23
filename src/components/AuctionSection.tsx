import React, { useState } from 'react';
import { AuctionItem, UserSession } from '../types';
import { EVENT_DETAILS, getItemBudgetPercentage } from '../data/eventData';
import { ResourceDetailModal } from './ResourceDetailModal';
import {
  Wallet,
  Eye,
  Plus,
  Check,
  RotateCcw,
  Sparkles,
  Droplets,
  HeartPulse,
  GraduationCap,
  Trash2,
  Bus,
  Accessibility,
  Briefcase,
  ShieldAlert,
  Trees,
  Layers,
  Info,
  Scale,
  ShieldCheck,
  AlertCircle,
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
  CloudRain,
  Cpu,
  Wrench,
  Gavel,
  Lock,
  Edit3,
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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
  Wallet,
  Eye,
};

interface AuctionSectionProps {
  auctionItems: AuctionItem[];
  draftedItemIds: string[];
  onToggleDraft: (item: AuctionItem) => void;
  onResetDraft: () => void;
  isDarkMode: boolean;
  currentUserTeamName?: string;
  overallBudget?: number;
  userSession?: UserSession;
  onUpdateItemStartingPrice?: (itemId: string, newPrice: number) => void;
}

export const AuctionSection: React.FC<AuctionSectionProps> = ({
  auctionItems,
  draftedItemIds,
  onToggleDraft,
  onResetDraft,
  isDarkMode,
  currentUserTeamName,
  overallBudget,
  userSession,
  onUpdateItemStartingPrice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<AuctionItem | null>(null);

  const isAdmin = userSession?.role === 'admin';

  const categories = [
    'All',
    'Vital Infrastructure',
    'Human Welfare',
    'Environment & Ecology',
    'Civic Resilience',
    'Economy & Innovation',
    'Governance & Digital',
  ];

  const filteredItems = auctionItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.impactDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Compute simulated draft stats based on dynamic overall budget
  const effectiveBudget = overallBudget || EVENT_DETAILS.exampleBudget;
  const totalDraftedCost = draftedItemIds.reduce((sum, id) => {
    const item = auctionItems.find((i) => i.id === id);
    return sum + (item ? item.startingPrice : 0);
  }, 0);

  const simulatedRemaining = effectiveBudget - totalDraftedCost;
  const isOverBudget = simulatedRemaining < 0;

  // Society Balance Metric Calculation
  const hasWater = draftedItemIds.some((id) =>
    ['clean-water', 'desalination-treatment', 'flood-sponge-network', 'smart-water-metering', 'stormwater-caverns', 'neighbourhood-cisterns'].includes(id)
  );
  const hasHealth = draftedItemIds.some((id) =>
    ['healthcare', 'mental-care', 'mobile-health-clinics', 'addiction-recovery', 'pediatric-trauma-units', 'community-mental-wellness'].includes(id)
  );
  const hasEdu = draftedItemIds.some((id) =>
    ['education', 'public-libraries', 'climate-resilience-academy', 'childcare-early-learning', 'universal-school-nutrition'].includes(id)
  );
  const hasEnv = draftedItemIds.some((id) =>
    [
      'environment',
      'waste-mgmt',
      'mangrove-coastal-shield',
      'soil-regeneration',
      'clean-air-defense',
      'zero-plastic-pact',
      'reforestation-drone-fleet',
      'miyawaki-microforests',
      'wetland-bioremediation',
      'riparian-buffer-zones',
      'ocean-trash-skimmers',
    ].includes(id)
  );
  const hasJobs = draftedItemIds.some((id) =>
    ['employment', 'circular-economy', 'green-hydrogen-hub', 'vocational-training', 'social-enterprise-grants', 'electrified-freight-rail', 'cleantech-patent-commons', 'rooftop-hydroponics'].includes(id)
  );
  const hasEnergy = draftedItemIds.some((id) =>
    ['renewable-energy', 'microgrid-storage', 'neighborhood-energy-coops', 'offshore-wind-arrays', 'tidal-wave-power', 'biomethane-grid'].includes(id)
  );

  const balanceScore = Math.min(
    100,
    Math.round(
      (draftedItemIds.length / 10) * 50 +
        (hasWater ? 10 : 0) +
        (hasHealth ? 10 : 0) +
        (hasEnv ? 10 : 0) +
        (hasJobs ? 10 : 0) +
        (hasEnergy ? 10 : 0)
    )
  );

  return (
    <section
      id="auction"
      className={`py-24 relative border-b transition-colors duration-300 overflow-hidden ${
        isDarkMode ? 'bg-[#04130d] border-emerald-950/40 text-slate-200' : 'bg-emerald-50/30 border-emerald-200 text-slate-800'
      }`}
    >
      {/* Blueprint grid background in green/blue */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-['Space_Mono'] uppercase tracking-widest mb-4 border ${
              isDarkMode
                ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>TRIAL & ERROR STRATEGY LAB // 28 CIVIC ASSETS</span>
          </div>

          <h2
            className={`font-['Chakra_Petch'] font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            RESOURCE ALLOCATION SANDBOX
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-sans leading-relaxed">
            Test and experiment with your team's strategy through trial and error! Choose and keep resources to see how your society resilience index balances against your ₹{effectiveBudget.toLocaleString()} fund. Changes here are for sandbox planning and are <strong>not reflected in your official portfolio</strong>.
          </p>
        </div>

        {/* Visual Fictional Wallet / Budget Interface */}
        <div
          id="society-fund-wallet"
          className={`mb-12 rounded-2xl border-2 p-6 sm:p-8 shadow-2xl corner-brackets ${
            isDarkMode
              ? 'bg-gradient-to-r from-[#03130c]/95 via-[#062419]/95 to-[#03130c]/95 border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-white border-emerald-500/50 shadow-xl'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-emerald-900/40">
            {/* Wallet Header & Balance */}
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                  isDarkMode
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                }`}
              >
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-['Space_Mono'] uppercase tracking-wider text-slate-400">
                    SOCIETY TREASURY WALLET
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    OFFICIAL BUDGET
                  </span>
                  {currentUserTeamName && (
                    <span className="text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded">
                      Team: {currentUserTeamName}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                  <span
                    className={`font-['Chakra_Petch'] font-extrabold text-2xl sm:text-4xl tracking-wider ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    YOUR SOCIETY FUND:
                  </span>
                  <span
                    className={`font-['Space_Mono'] font-bold text-2xl sm:text-4xl ${
                      isOverBudget ? 'text-cyan-400' : 'text-emerald-400'
                    }`}
                  >
                    ₹{simulatedRemaining.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    / ₹{effectiveBudget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Fictional Budget Notification Disclaimer - Green & Blue Theme */}
            <div
              className={`max-w-md p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                isDarkMode
                  ? 'bg-[#02180e] border-emerald-500/30 text-emerald-200/90'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-400 block mb-0.5 font-mono">
                  NOTICE FOR PARTICIPANTS:
                </span>
                <span>{EVENT_DETAILS.budgetNote}</span>
              </div>
            </div>
          </div>

          {/* Wallet Interactive Strategy Toolbar */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div
              className={`p-3 rounded-xl border ${
                isDarkMode ? 'bg-[#02180e] border-emerald-950' : 'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Committed Allocation</span>
              <span
                className={`font-mono font-bold text-base ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                ₹{totalDraftedCost.toLocaleString()} Allocated
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                isDarkMode ? 'bg-[#02180e] border-emerald-950' : 'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Selected Assets</span>
              <span className="font-mono font-bold text-base text-emerald-400">
                {draftedItemIds.length} of {auctionItems.length} Resources
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                isDarkMode ? 'bg-[#02180e] border-emerald-950' : 'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Society Balance Index</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-full bg-emerald-950/80 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-sky-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${balanceScore}%` }}
                  ></div>
                </div>
                <span
                  className={`text-xs font-mono font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {balanceScore}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetDraft}
                disabled={draftedItemIds.length === 0}
                className={`w-full py-2.5 px-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-emerald-950/40 hover:bg-emerald-900/50 text-slate-300 border-emerald-800/60'
                    : 'bg-emerald-100/70 hover:bg-emerald-200 text-slate-800 border-emerald-300'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Selection</span>
              </button>
            </div>
          </div>

          {/* Warning banner if over budget - Greens & Blues Only */}
          {isOverBudget && (
            <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Allocated budget exceeded by ₹{Math.abs(simulatedRemaining).toLocaleString()}. In the live auction, bids exceeding your allocated funds are strictly rejected!
              </span>
            </div>
          )}
        </div>

        {/* Search & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-['Space_Mono'] uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 border-emerald-400'
                    : isDarkMode
                    ? 'bg-emerald-950/30 text-slate-400 border-emerald-900/50 hover:text-slate-200 hover:bg-emerald-900/40'
                    : 'bg-white text-slate-600 border-emerald-200 hover:text-slate-900 hover:bg-emerald-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder={`Search ${auctionItems.length} resources...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full md:w-56 px-3 py-1.5 rounded-lg text-xs font-mono outline-none border transition-colors ${
                isDarkMode
                  ? 'bg-[#02180e] border-emerald-900/60 text-white placeholder:text-slate-500 focus:border-emerald-400'
                  : 'bg-white border-emerald-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
              }`}
            />
            <span className="text-xs font-mono text-slate-400 shrink-0">
              Showing <span className="text-emerald-400 font-bold">{filteredItems.length}</span> items
            </span>
          </div>
        </div>

        {/* Interactive Auction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = iconMap[item.iconName] || Layers;
            const isDrafted = draftedItemIds.includes(item.id);
            const isSold = item.status === 'sold';
            const isOwnedByCurrentTeam = !!currentUserTeamName && item.soldToTeam?.toLowerCase() === currentUserTeamName.toLowerCase();
            const canAfford = simulatedRemaining >= item.startingPrice || isDrafted;
            const itemPct = item.percentage ?? getItemBudgetPercentage(item.id);

            return (
              <div
                key={item.id}
                id={`auction-card-${item.id}`}
                className={`group relative rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between corner-brackets ${
                  isSold && !isOwnedByCurrentTeam
                    ? 'opacity-85 border-slate-800 bg-slate-950/40'
                    : isSold && isOwnedByCurrentTeam
                    ? isDarkMode
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : 'bg-emerald-50 border-emerald-500 shadow-md'
                    : isDrafted
                    ? isDarkMode
                      ? 'bg-[#062419] border-emerald-400/80 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-400/50'
                      : 'bg-emerald-50/70 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : isDarkMode
                    ? 'bg-[#02180e]/90 border-emerald-950/80 hover:border-emerald-500/50 hover:bg-[#042013] hover:-translate-y-1'
                    : 'bg-white border-emerald-200 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Top Badge: Category & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-950/60">
                    <span
                      className={`text-[10px] font-['Space_Mono'] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isDarkMode ? 'bg-[#041d11] border-emerald-900 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}
                    >
                      {item.category}
                    </span>

                    {isSold ? (
                      isOwnedByCurrentTeam ? (
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" /> WON BY YOUR TEAM
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> EXCLUSIVELY BOUGHT BY {item.soldToTeam?.toUpperCase()}
                        </span>
                      )
                    ) : isDrafted ? (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> IN TRIAL SANDBOX
                      </span>
                    ) : null}
                  </div>

                  {/* Resource Icon & Name */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${item.colorAccent}15`,
                        borderColor: `${item.colorAccent}40`,
                        color: item.colorAccent,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-['Chakra_Petch'] font-bold text-lg uppercase tracking-wide group-hover:text-emerald-400 transition-colors ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] font-mono text-slate-400">
                          {isSold ? 'Hammer Price:' : 'Dynamic Cost:'}
                        </span>
                        <span
                          className={`font-['Space_Mono'] font-bold text-base ${
                            isSold ? 'text-cyan-300' : 'text-emerald-400'
                          }`}
                        >
                          ₹{(isSold && item.soldPrice ? item.soldPrice : item.startingPrice).toLocaleString()}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            isDarkMode
                              ? 'bg-emerald-950/60 border-emerald-900 text-emerald-400'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          }`}
                          title={`${itemPct}% of overall society fund`}
                        >
                          {itemPct}% of fund
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Short Societal-Impact Description */}
                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed mb-4">
                    {item.impactDescription}
                  </p>
                  {isSold && !isOwnedByCurrentTeam && (
                    <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-cyan-950/30 border border-cyan-900/40 text-[11px] font-mono text-cyan-300/80 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>Exclusively acquired by {item.soldToTeam}. Not available to other participants.</span>
                    </div>
                  )}
                </div>

                {/* Card Action Controls: VIEW RESOURCE & ADD / EDIT BUDGET */}
                <div className="pt-4 border-t border-emerald-950/60 flex items-center gap-2.5">
                  <button
                    type="button"
                    id={`view-resource-${item.id}`}
                    onClick={() => setActiveModalItem(item)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-['Space_Mono'] uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isDarkMode
                        ? 'bg-emerald-950/40 hover:bg-emerald-900/50 text-slate-200 border-emerald-900/60'
                        : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VIEW RESOURCE</span>
                  </button>

                  {/* Admin role can view resource and edit budget */}
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(item)}
                      className={`py-2 px-3 rounded-lg text-xs font-['Space_Mono'] uppercase font-bold flex items-center justify-center gap-1 transition-all border cursor-pointer ${
                        isDarkMode
                          ? 'bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border-cyan-800/60'
                          : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-300'
                      }`}
                      title="Edit resource budget"
                    >
                      <Edit3 className="w-3 h-3 text-cyan-400" />
                      <span>EDIT BUDGET</span>
                    </button>
                  ) : isSold ? (
                    isOwnedByCurrentTeam ? (
                      <span className="py-2 px-3 rounded-lg text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>ACQUIRED</span>
                      </span>
                    ) : (
                      <span
                        className="py-2 px-3 rounded-lg text-[11px] font-mono text-slate-500 bg-slate-900/80 border border-slate-800 flex items-center gap-1 cursor-not-allowed select-none"
                        title={`Resource acquired exclusively by ${item.soldToTeam}. Unavailable to other participants.`}
                      >
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>EXCLUSIVE</span>
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      id={`draft-toggle-${item.id}`}
                      onClick={() => onToggleDraft(item)}
                      className={`py-2 px-3 rounded-lg text-xs font-['Space_Mono'] uppercase font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isDrafted
                          ? 'bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/50'
                          : canAfford
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                          : 'opacity-40 cursor-not-allowed border border-slate-700'
                      }`}
                      title={isDrafted ? 'Remove from trial sandbox' : 'Add to trial sandbox'}
                    >
                      {isDrafted ? (
                        <span>REMOVE</span>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>TRIAL ADD</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource Detail Specification Modal */}
      {activeModalItem && (
        <ResourceDetailModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onSimulateBid={!isAdmin ? onToggleDraft : undefined}
          isDrafted={draftedItemIds.includes(activeModalItem.id)}
          canAfford={simulatedRemaining >= activeModalItem.startingPrice || draftedItemIds.includes(activeModalItem.id)}
          isDarkMode={isDarkMode}
          isAdmin={isAdmin}
          onUpdateStartingPrice={onUpdateItemStartingPrice}
        />
      )}
    </section>
  );
};
