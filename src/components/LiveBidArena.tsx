import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Users,
  Shield,
  Zap,
  ArrowUpRight,
  Flame,
  Plus,
  Award,
  Lock,
  DollarSign
} from 'lucide-react';
import { AuctionItem, RegisteredTeam, UserSession, ActiveLiveBid, BidLog } from '../types';

interface LiveBidArenaProps {
  auctionItems: AuctionItem[];
  registeredTeams: RegisteredTeam[];
  userSession: UserSession;
  overallBudget: number;
  activeBid: ActiveLiveBid | null;
  onStartBid: (itemId: string, startingPrice: number, durationSeconds: number, forceReopen?: boolean) => void;
  onPlaceBid: (teamName: string, amount: number) => { success: boolean; error?: string };
  onPauseResumeBid: () => void;
  onAddSeconds: (seconds: number) => void;
  onEndBid: (declareWinner?: boolean) => void;
  onResetBid: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  isDarkMode: boolean;
}

export const LiveBidArena: React.FC<LiveBidArenaProps> = ({
  auctionItems,
  registeredTeams,
  userSession,
  overallBudget,
  activeBid,
  onStartBid,
  onPlaceBid,
  onPauseResumeBid,
  onAddSeconds,
  onEndBid,
  onResetBid,
  onOpenLogin,
  onOpenRegister,
  isDarkMode,
}) => {
  // Anti-spam bidding cooldown timer (in seconds)
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Admin form state for initiating a bid
  const availableItems = auctionItems.filter((i) => i.status !== 'sold');
  const soldItems = auctionItems.filter((i) => i.status === 'sold');
  const [allowReauctionSold, setAllowReauctionSold] = useState<boolean>(false);

  const [selectedItemId, setSelectedItemId] = useState<string>(
    availableItems[0]?.id || ''
  );
  const selectedItemObj = auctionItems.find((i) => i.id === selectedItemId);

  const [startPriceInput, setStartPriceInput] = useState<number>(
    selectedItemObj?.startingPrice || 1000
  );
  const [durationInput, setDurationInput] = useState<number>(60);

  // Participant or Admin bid input
  const [bidAmountInput, setBidAmountInput] = useState<string>('');
  const [adminBiddingTeam, setAdminBiddingTeam] = useState<string>(
    registeredTeams[0]?.teamName || ''
  );
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Sync starting price when selected item changes
  useEffect(() => {
    if (selectedItemObj) {
      setStartPriceInput(selectedItemObj.startingPrice);
    }
  }, [selectedItemId]);

  // Keep admin bidding team valid
  useEffect(() => {
    if (!adminBiddingTeam && registeredTeams.length > 0) {
      setAdminBiddingTeam(registeredTeams[0].teamName);
    }
  }, [registeredTeams, adminBiddingTeam]);

  // Find user's team details if participant
  const userTeam = registeredTeams.find(
    (t) =>
      t.teamName.toLowerCase() === userSession.teamName?.toLowerCase() ||
      t.leaderEmail.toLowerCase() === userSession.email?.toLowerCase() ||
      t.id === userSession.teamId
  );

  // Calculate user team's remaining budget
  const getUserTeamRemainingBudget = (team: RegisteredTeam | undefined) => {
    if (!team) return overallBudget;
    const teamBudget = team.fictionalBudget || overallBudget;
    // Calculate total spent on sold items
    const spentOnSold = auctionItems
      .filter((i) => i.status === 'sold' && i.soldToTeam?.toLowerCase() === team.teamName.toLowerCase())
      .reduce((sum, item) => sum + (item.soldPrice || item.startingPrice), 0);
    return Math.max(0, teamBudget - spentOnSold);
  };

  const userTeamBudgetLeft = getUserTeamRemainingBudget(userTeam);

  // Handle placing a bid with cooldown anti-spam protection
  const handlePlaceBidSubmit = (amount: number, teamNameToUse?: string) => {
    setFeedbackMsg(null);

    if (cooldownSeconds > 0) {
      setFeedbackMsg({
        text: `Anti-spam cooldown active: Please wait ${cooldownSeconds}s before placing another bid.`,
        isError: true,
      });
      return;
    }

    const targetTeam = teamNameToUse || (userSession.role === 'admin' ? adminBiddingTeam : userSession.teamName);

    if (!targetTeam) {
      setFeedbackMsg({ text: 'Please specify the bidding team name.', isError: true });
      return;
    }

    if (!activeBid || activeBid.status !== 'bidding') {
      setFeedbackMsg({ text: 'There is no active bid in progress.', isError: true });
      return;
    }

    if (amount <= activeBid.currentBid) {
      setFeedbackMsg({
        text: `Bid must be higher than current bid (₹${activeBid.currentBid.toLocaleString()}).`,
        isError: true,
      });
      return;
    }

    // Check if target team has enough budget
    const targetTeamObj = registeredTeams.find((t) => t.teamName.toLowerCase() === targetTeam.toLowerCase());
    const budgetLeft = getUserTeamRemainingBudget(targetTeamObj);
    if (budgetLeft < amount) {
      setFeedbackMsg({
        text: `${targetTeam} only has ₹${budgetLeft.toLocaleString()} available. Cannot bid ₹${amount.toLocaleString()}.`,
        isError: true,
      });
      return;
    }

    const res = onPlaceBid(targetTeam, amount);
    if (!res.success) {
      setFeedbackMsg({ text: res.error || 'Failed to place bid', isError: true });
    } else {
      // Trigger 4-second anti-spam cooldown on client
      setCooldownSeconds(4);
      setFeedbackMsg({ text: `Bid of ₹${amount.toLocaleString()} placed for ${targetTeam}!`, isError: false });
      setBidAmountInput('');
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentItemOnBlock = activeBid
    ? auctionItems.find((i) => i.id === activeBid.itemId)
    : null;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>LIVE AUCTION FLOOR • NSS CLUB</span>
          </div>
          <h2
            className={`font-['Chakra_Petch'] font-black text-2xl sm:text-4xl uppercase tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            INTERACTIVE BIDDING ARENA
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1 font-sans">
            Every resource is unique and can be bought by <strong>strictly one team</strong>. Watch the live timer, raise bids, and win critical civic assets for your society.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Available: <strong>{availableItems.length}</strong></span>
          </div>
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Sold: <strong>{soldItems.length}</strong> / {auctionItems.length}</span>
          </div>
        </div>
      </div>

      {/* Main Bidding Arena Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center: The Live Auction Block (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeBid && activeBid.status !== 'idle' ? (
            <div
              className={`rounded-2xl border p-6 sm:p-8 transition-all relative overflow-hidden ${
                isDarkMode
                  ? 'bg-[#090f1e] border-emerald-500/40 shadow-2xl shadow-emerald-500/5'
                  : 'bg-white border-emerald-300 shadow-xl'
              }`}
            >
              {/* Top Item Badge & Category */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-mono uppercase font-bold text-emerald-500 tracking-wider">
                    NOW ON THE BLOCK • {activeBid.category}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase font-bold ${
                    activeBid.status === 'bidding'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : activeBid.status === 'paused'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : activeBid.status === 'sold'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-500/15 text-slate-400'
                  }`}
                >
                  {activeBid.status === 'bidding'
                    ? 'BIDDING OPEN'
                    : activeBid.status === 'paused'
                    ? 'TIMER PAUSED'
                    : activeBid.status === 'sold'
                    ? 'SOLD!'
                    : 'PASSED'}
                </span>
              </div>

              {/* Item Name & Details */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3
                    className={`font-['Chakra_Petch'] font-black text-2xl sm:text-3xl uppercase tracking-wide ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {activeBid.itemName}
                  </h3>
                  {currentItemOnBlock?.percentage && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {currentItemOnBlock.percentage}% of Society Fund (Base ₹{currentItemOnBlock.startingPrice.toLocaleString()})
                    </span>
                  )}
                </div>
                {currentItemOnBlock && (
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    {currentItemOnBlock.impactDescription}
                  </p>
                )}
              </div>

              {/* The Live Timer & Current Price Board */}
              <div
                className={`p-6 rounded-2xl border mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center ${
                  isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {/* Countdown Timer */}
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>BID TIMER REMAINING</span>
                  </span>
                  <div
                    className={`font-['Space_Mono'] font-bold text-4xl sm:text-5xl tracking-tight ${
                      activeBid.remainingSeconds <= 10 && activeBid.status === 'bidding'
                        ? 'text-cyan-400 animate-pulse'
                        : 'text-emerald-500'
                    }`}
                  >
                    {formatTime(activeBid.remainingSeconds)}
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3 max-w-[200px]">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        activeBid.remainingSeconds <= 10 ? 'bg-cyan-400' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            (activeBid.remainingSeconds / (activeBid.totalDurationSeconds || 60)) * 100
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Current Highest Bid */}
                <div className="flex flex-col items-center sm:items-end border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>CURRENT HIGHEST BID</span>
                  </span>
                  <div
                    className={`font-['Space_Mono'] font-extrabold text-3xl sm:text-4xl text-emerald-400`}
                  >
                    ₹{activeBid.currentBid.toLocaleString()}
                  </div>
                  <div className="text-xs font-mono mt-1 text-slate-400">
                    Leader:{' '}
                    <span className="font-bold text-white uppercase bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
                      {activeBid.currentBidderTeam || 'No Bids Yet (Base Price)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Notice if Sold */}
              {activeBid.status === 'sold' && (
                <div className="p-4 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-200 mb-6 flex items-center gap-3">
                  <Gavel className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm uppercase">AUCTION HAMMER DOWN!</h4>
                    <p className="text-xs">
                      Sold exclusively to <strong>{activeBid.winnerTeam}</strong> for{' '}
                      <strong>₹{activeBid.winningPrice?.toLocaleString()}</strong>! No other team can acquire this resource.
                    </p>
                  </div>
                </div>
              )}

              {/* Bid History Ticker */}
              <div className="mb-6">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  BIDDING LOG ({activeBid.bidsHistory.length} BIDS):
                </span>
                <div
                  className={`max-h-36 overflow-y-auto rounded-xl p-3 border space-y-2 text-xs font-mono ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {activeBid.bidsHistory.length === 0 ? (
                    <div className="text-slate-500 text-center py-2">
                      Auction started at base price ₹{activeBid.startingPrice.toLocaleString()}. Awaiting first team bid!
                    </div>
                  ) : (
                    activeBid.bidsHistory.slice().reverse().map((bid, idx) => (
                      <div
                        key={bid.id || idx}
                        className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-500 font-bold">{bid.teamName}</span>
                          <span className="text-slate-500 text-[10px]">{bid.timestamp}</span>
                        </div>
                        <span className="text-white font-bold">₹{bid.amount.toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Participant Place Bid Interface */}
              {activeBid.status === 'bidding' && (
                <div
                  className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-300'
                  }`}
                >
                  {userSession.isLoggedIn ? (
                    userSession.role === 'participant' ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono text-slate-400">
                            Logged in as: <strong>{userSession.teamName}</strong>
                          </span>
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            Remaining Budget: ₹{userTeamBudgetLeft.toLocaleString()}
                          </span>
                        </div>

                        {/* Anti-spam Cooldown Warning */}
                        {cooldownSeconds > 0 && (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-3">
                            <Clock className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                            <span>
                              <strong>ANTI-SPAM COOLDOWN ACTIVE:</strong> Please wait {cooldownSeconds}s before placing another bid.
                            </span>
                          </div>
                        )}

                        {/* Quick Increment Buttons (Scaled to ₹10 Lakhs fund) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                          <button
                            type="button"
                            onClick={() => handlePlaceBidSubmit(activeBid.currentBid + 2000)}
                            disabled={cooldownSeconds > 0 || userTeamBudgetLeft < activeBid.currentBid + 2000}
                            className="py-2.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition-all disabled:opacity-40"
                          >
                            + ₹2,000
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlaceBidSubmit(activeBid.currentBid + 5000)}
                            disabled={cooldownSeconds > 0 || userTeamBudgetLeft < activeBid.currentBid + 5000}
                            className="py-2.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition-all disabled:opacity-40"
                          >
                            + ₹5,000
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlaceBidSubmit(activeBid.currentBid + 10000)}
                            disabled={cooldownSeconds > 0 || userTeamBudgetLeft < activeBid.currentBid + 10000}
                            className="py-2.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition-all disabled:opacity-40"
                          >
                            + ₹10,000
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlaceBidSubmit(activeBid.currentBid + 25000)}
                            disabled={cooldownSeconds > 0 || userTeamBudgetLeft < activeBid.currentBid + 25000}
                            className="py-2.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition-all disabled:opacity-40"
                          >
                            + ₹25,000
                          </button>
                        </div>

                        {/* Custom Bid Input */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-xs font-mono text-slate-400">₹</span>
                            <input
                              type="number"
                              step="any"
                              disabled={cooldownSeconds > 0}
                              placeholder={`Min ₹${(activeBid.currentBid + 500).toLocaleString()}`}
                              value={bidAmountInput}
                              onChange={(e) => setBidAmountInput(e.target.value)}
                              className={`w-full pl-7 pr-3 py-2 rounded-lg text-xs font-mono border focus:outline-none focus:border-emerald-500 ${
                                isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300'
                              } disabled:opacity-50`}
                            />
                          </div>
                          <button
                            type="button"
                            disabled={cooldownSeconds > 0 || !bidAmountInput || Number(bidAmountInput) <= activeBid.currentBid}
                            onClick={() => handlePlaceBidSubmit(Number(bidAmountInput))}
                            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider disabled:opacity-40 transition-all"
                          >
                            {cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'Raise Bid'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Admin quick bid logger */
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                            Admin Floor Bid Logger
                          </span>
                          <span className="text-xs font-mono text-slate-400">Log bids called from the room</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <div>
                            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                              Select Bidding Team:
                            </label>
                            <select
                              value={adminBiddingTeam}
                              onChange={(e) => setAdminBiddingTeam(e.target.value)}
                              className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none ${
                                isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300'
                              }`}
                            >
                              {registeredTeams.map((t) => (
                                <option key={t.id} value={t.teamName}>
                                  {t.teamName} (₹{getUserTeamRemainingBudget(t).toLocaleString()} left)
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                              Custom Bid Amount:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                step="any"
                                placeholder={`Min ₹${activeBid.currentBid + 500}`}
                                value={bidAmountInput}
                                onChange={(e) => setBidAmountInput(e.target.value)}
                                className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none ${
                                  isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => handlePlaceBidSubmit(Number(bidAmountInput), adminBiddingTeam)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase shrink-0"
                              >
                                Log
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quick increments for selected team */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Quick Add:</span>
                          <button
                            type="button"
                            onClick={() => handlePlaceBidSubmit(activeBid.currentBid + 2000, adminBiddingTeam)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400"
                          >
                            +₹2,000
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlaceBidSubmit(activeBid.currentBid + 5000, adminBiddingTeam)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400"
                          >
                            +₹5,000
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlaceBidSubmit(activeBid.currentBid + 10000, adminBiddingTeam)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400"
                          >
                            +₹10,000
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlaceBidSubmit(activeBid.currentBid + 25000, adminBiddingTeam)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400"
                          >
                            +₹25,000
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-xs text-slate-400 font-mono mb-2">
                        Sign in as a registered team to participate and place bids directly from your device.
                      </p>
                      <button
                        type="button"
                        onClick={onOpenLogin}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-mono text-xs font-bold uppercase"
                      >
                        Sign In with Team Email
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Message */}
              {feedbackMsg && (
                <div
                  className={`mt-4 p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                    feedbackMsg.isError
                      ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300'
                      : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {feedbackMsg.isError ? (
                    <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  <span>{feedbackMsg.text}</span>
                </div>
              )}
            </div>
          ) : (
            /* Standby Card when no bid is active */
            <div
              className={`p-10 rounded-2xl border text-center transition-all ${
                isDarkMode ? 'bg-[#090f1e] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto mb-4">
                <Gavel className="w-8 h-8" />
              </div>
              <h3
                className={`font-['Chakra_Petch'] font-bold text-2xl uppercase mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                AUCTION BLOCK IS CURRENTLY IDLE
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 font-sans">
                The auctioneer has not yet called the next resource to the stage. When a bid begins, the countdown timer and real-time bid board will appear here automatically.
              </p>

              {userSession.role === 'admin' ? (
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Use the Admin Bidding Console on the right to start a round!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Standing by for next civic asset announcement...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Admin Controls & Floor Live Operations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Admin Controls Panel */}
          {userSession.role === 'admin' ? (
            <div
              className={`rounded-2xl border p-6 transition-all ${
                isDarkMode ? 'bg-[#0b1224] border-emerald-500/30' : 'bg-white border-slate-300 shadow-md'
              }`}
            >
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <h3
                  className={`font-['Chakra_Petch'] font-bold text-base uppercase tracking-wider ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  ADMIN AUCTIONEER CONSOLE
                </h3>
              </div>

              {/* Start Bid Controls */}
              {(!activeBid || activeBid.status === 'idle' || activeBid.status === 'sold' || activeBid.status === 'passed') ? (
                <div className="space-y-4">
                  {/* Re-auction override control */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allow-reauction-toggle"
                        checked={allowReauctionSold}
                        onChange={(e) => setAllowReauctionSold(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="allow-reauction-toggle" className="text-xs font-mono text-slate-300 cursor-pointer select-none">
                        Admin Override: Allow Re-Auctioning Sold Items
                      </label>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {soldItems.length} Acquired
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">
                      1. Select Civic Resource ({allowReauctionSold ? auctionItems.length : availableItems.length} Available to Present):
                    </label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-500 ${
                        isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    >
                      {(allowReauctionSold ? auctionItems : availableItems).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.status === 'sold'
                            ? `🔒 [BOUGHT BY ${item.soldToTeam}] ${item.name} (${item.percentage || 10}%, ₹${item.startingPrice.toLocaleString()})`
                            : `${item.name} (${item.percentage || 10}%, ₹${item.startingPrice.toLocaleString()}) - ${item.category}`}
                        </option>
                      ))}
                    </select>
                    {!allowReauctionSold && soldItems.length > 0 && (
                      <p className="text-[11px] font-mono text-slate-500 mt-1">
                        * {soldItems.length} resource(s) already bought exclusively. Hidden from auction unless override is checked above.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">
                        2. Starting Bid (₹):
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={startPriceInput}
                        onChange={(e) => setStartPriceInput(Number(e.target.value))}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-500 ${
                          isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">
                        3. Timer (Seconds):
                      </label>
                      <select
                        value={durationInput}
                        onChange={(e) => setDurationInput(Number(e.target.value))}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-500 ${
                          isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      >
                        <option value={30}>30 Seconds (Blitz)</option>
                        <option value={45}>45 Seconds</option>
                        <option value={60}>60 Seconds (Standard)</option>
                        <option value={90}>90 Seconds</option>
                        <option value={120}>120 Seconds (2 Mins)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedItemId) return;
                      const itm = auctionItems.find((i) => i.id === selectedItemId);
                      if (itm?.status === 'sold') {
                        const confirmed = window.confirm(
                          `Resource "${itm.name}" was already acquired exclusively by ${itm.soldToTeam}.\n\nRe-auctioning will re-open it to the bidding floor and clear previous exclusivity.\n\nAre you sure you want to re-present this resource?`
                        );
                        if (!confirmed) return;
                        onStartBid(selectedItemId, Number(startPriceInput), Number(durationInput), true);
                        return;
                      }
                      onStartBid(selectedItemId, Number(startPriceInput), Number(durationInput), false);
                    }}
                    disabled={!selectedItemId || (allowReauctionSold ? auctionItems.length === 0 : availableItems.length === 0)}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Gavel className="w-4 h-4 text-slate-950" />
                    <span>START LIVE BID WITH TIMER</span>
                  </button>
                </div>
              ) : (
                /* Live Controls during active round */
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                    Active Item: <strong>{activeBid.itemName}</strong>
                    <br />
                    Current Bid: <strong>₹{activeBid.currentBid.toLocaleString()}</strong> by{' '}
                    <strong>{activeBid.currentBidderTeam || 'Nobody yet'}</strong>
                  </div>

                  {/* Timer Modifiers */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={onPauseResumeBid}
                      className="py-2.5 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    >
                      {activeBid.isRunning ? (
                        <>
                          <Pause className="w-4 h-4 text-cyan-400" />
                          <span>PAUSE TIMER</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-emerald-400" />
                          <span>RESUME TIMER</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddSeconds(15)}
                      className="py-2.5 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+15 SECONDS</span>
                    </button>
                  </div>

                  {/* End Bid / Hammer Down */}
                  <button
                    type="button"
                    onClick={() => onEndBid(true)}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 cursor-pointer"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>HAMMER DOWN: SELL TO {activeBid.currentBidderTeam ? activeBid.currentBidderTeam.toUpperCase() : 'CALL TIME'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onResetBid}
                    className="w-full py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel / Reset Round
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Participant Info Box */
            <div
              className={`rounded-2xl border p-6 ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Gavel className="w-4 h-4 text-emerald-500" />
                <h4
                  className={`font-['Chakra_Petch'] font-bold text-sm uppercase ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  LIVE BIDDING PROTOCOL
                </h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2.5 font-sans leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Single-Buyer Exclusivity:</strong> Once hammer goes down, that resource is 100% owned by the winning team. No other team can buy it.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Instant Treasury Deduction:</strong> The winning amount is immediately subtracted from your starting ₹{overallBudget.toLocaleString()} allocation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Live Countdown:</strong> When bids are submitted near zero, the auctioneer may extend the clock by +15 seconds.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Quick Enrolled Teams Status */}
          <div
            className={`rounded-2xl border p-6 ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>CONFIRMED TEAMS ({registeredTeams.length})</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-500">Starting: ₹{overallBudget.toLocaleString()}</span>
            </div>

            {registeredTeams.length === 0 ? (
              <div className="text-center py-4 text-xs font-mono text-slate-500">
                No teams registered yet. Be the first to register your team!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {registeredTeams.map((team) => {
                  const remaining = getUserTeamRemainingBudget(team);
                  const isCurrent = userSession.teamName?.toLowerCase() === team.teamName.toLowerCase();
                  return (
                    <div
                      key={team.id}
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : isDarkMode
                          ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{team.teamName}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded">You</span>
                        )}
                      </div>
                      <span className="font-bold text-emerald-500">₹{remaining.toLocaleString()} left</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
