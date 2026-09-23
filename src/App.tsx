import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { AuctionSection } from './components/AuctionSection';
import { LockedAuctionTeaser } from './components/LockedAuctionTeaser';
import { RulesSection } from './components/RulesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { LiveBidArena } from './components/LiveBidArena';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { RegistrationSection } from './components/RegistrationSection';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { LoginModal } from './components/LoginModal';
import { AdminPanel } from './components/AdminPanel';
import { StickyMobileRegister } from './components/StickyMobileRegister';
import { AUCTION_ITEMS, EVENT_DETAILS, INITIAL_REGISTERED_TEAMS, ITEM_BASELINE_PERCENTAGES } from './data/eventData';
import { AuctionItem, RegisteredTeam, UserSession, NavigationTab, ActiveLiveBid, BidLog } from './types';
import { Gavel, BookOpen, Layers, ShieldCheck, ArrowRight, User, Award, CheckCircle2, Lock, Shield, Briefcase } from 'lucide-react';

export default function App() {
  // Theme state: dark (default) or light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('suc_theme');
    return saved ? saved === 'dark' : true;
  });

  // Current Active Section Tab: changes view instead of scrolling
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  // Overall Auction Budget: configurable by Admin, defaults to 10 Lakhs (1,000,000)
  const [overallBudget, setOverallBudget] = useState<number>(() => {
    const saved = localStorage.getItem('suc_overall_budget');
    if (saved && Number(saved) !== 10000) {
      return Number(saved);
    }
    return 1000000;
  });

  // User session state
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('suc_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { isLoggedIn: false, email: '', role: 'guest' };
  });

  // Registered teams database (persisted via Server API and client storage)
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>(() => {
    try {
      const saved = localStorage.getItem('suc_registered_teams');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter((t: RegisteredTeam) => t.id !== 'GPA-582910');
          // Merge with initial registered teams so seeded teams in repo are never missing
          const map = new Map<string, RegisteredTeam>();
          INITIAL_REGISTERED_TEAMS.forEach((t) => map.set(t.id, t));
          cleaned.forEach((t: RegisteredTeam) => map.set(t.id, t));
          const combined = Array.from(map.values());
          return combined;
        }
      }
    } catch (e) {
      console.error('Error parsing registered teams from storage', e);
    }
    return INITIAL_REGISTERED_TEAMS;
  });

  // Fetch teams from server API to sync all clients and devices
  const fetchTeamsFromServer = async () => {
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        // Ensure response is valid JSON and not an HTML SPA fallback
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setRegisteredTeams((prev) => {
              const map = new Map<string, RegisteredTeam>();
              INITIAL_REGISTERED_TEAMS.forEach((t) => map.set(t.id, t));
              prev.forEach((t) => map.set(t.id, t));
              data.forEach((t) => map.set(t.id, t));
              const combined = Array.from(map.values());
              try {
                localStorage.setItem('suc_registered_teams', JSON.stringify(combined));
              } catch {}
              return combined;
            });
            return data;
          }
        }
      }
    } catch {
      // Offline or static hosting
    }
    return null;
  };

  // Cross-tab and window storage synchronizer for registered teams
  const syncTeamsFromStorage = () => {
    fetchTeamsFromServer();
    try {
      const saved = localStorage.getItem('suc_registered_teams');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRegisteredTeams((prev) => {
            const map = new Map<string, RegisteredTeam>();
            INITIAL_REGISTERED_TEAMS.forEach((t) => map.set(t.id, t));
            prev.forEach((t) => map.set(t.id, t));
            parsed.forEach((t: RegisteredTeam) => map.set(t.id, t));
            return Array.from(map.values());
          });
        }
      }
    } catch (e) {
      console.error('Error syncing teams from storage', e);
    }
  };

  // Background polling to ensure every team getting registered is updated in the admin console
  useEffect(() => {
    fetchTeamsFromServer();
    const interval = setInterval(() => {
      fetchTeamsFromServer();
    }, 2500);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'suc_registered_teams') {
        syncTeamsFromStorage();
      }
    };

    const onWindowFocus = () => {
      syncTeamsFromStorage();
    };

    const onCustomSync = () => {
      syncTeamsFromStorage();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('suc_teams_sync', onCustomSync);

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('suc_teams_channel');
        bc.onmessage = () => {
          syncTeamsFromStorage();
        };
      } catch {
        // ignore
      }
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onWindowFocus);
      window.removeEventListener('suc_teams_sync', onCustomSync);
      if (bc) bc.close();
    };
  }, []);

  // Map of team name to last bid timestamp for anti-spam bidding cooldown
  const lastBidTimeMap = useRef<Record<string, number>>({});

  // Auction items catalog state (persisted locally so admin updates reflect dynamically)
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>(() => {
    const saved = localStorage.getItem('suc_auction_items');
    if (saved) {
      try {
        const parsed: AuctionItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedMap = new Map(parsed.map((item) => [item.id, item]));
          return AUCTION_ITEMS.map((defaultItem) => {
            const savedItem = savedMap.get(defaultItem.id);
            const percentage =
              savedItem && typeof savedItem.percentage === 'number' && !isNaN(savedItem.percentage)
                ? savedItem.percentage
                : (ITEM_BASELINE_PERCENTAGES[defaultItem.id] ?? defaultItem.percentage ?? 10);
            return {
              ...defaultItem,
              ...(savedItem
                ? {
                    status: savedItem.status,
                    soldToTeam: savedItem.soldToTeam,
                    soldPrice: savedItem.soldPrice,
                  }
                : {}),
              percentage,
              startingPrice: Math.round((overallBudget * percentage) / 100),
            };
          });
        }
      } catch {
        // fallback
      }
    }
    return AUCTION_ITEMS.map((item) => {
      const percentage = ITEM_BASELINE_PERCENTAGES[item.id] ?? 10;
      return {
        ...item,
        percentage,
        startingPrice: Math.round((overallBudget * percentage) / 100),
      };
    });
  });

  // Active Live Bid session state for the Live Bidding Floor
  const [activeLiveBid, setActiveLiveBid] = useState<ActiveLiveBid | null>(() => {
    const saved = localStorage.getItem('suc_active_live_bid');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return null;
  });

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedResourceForModal, setSelectedResourceForModal] = useState<AuctionItem | null>(null);

  // Drafted items for active team: start empty by default (no automatic additions upon registration)
  const [draftedItemIds, setDraftedItemIds] = useState<string[]>([]);

  // Sync theme changes to html root & localStorage
  useEffect(() => {
    localStorage.setItem('suc_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync session changes to localStorage
  useEffect(() => {
    localStorage.setItem('suc_user_session', JSON.stringify(userSession));
  }, [userSession]);

  // Auto-sync teams from storage whenever Admin opens panel
  useEffect(() => {
    if (isAdminOpen) {
      syncTeamsFromStorage();
    }
  }, [isAdminOpen]);

  // Sync teams changes to localStorage
  useEffect(() => {
    localStorage.setItem('suc_registered_teams', JSON.stringify(registeredTeams));
  }, [registeredTeams]);

  // Sync auction items to localStorage
  useEffect(() => {
    localStorage.setItem('suc_auction_items', JSON.stringify(auctionItems));
  }, [auctionItems]);

  // Sync overall budget to localStorage
  useEffect(() => {
    localStorage.setItem('suc_overall_budget', overallBudget.toString());
  }, [overallBudget]);

  // Sync active live bid to localStorage
  useEffect(() => {
    if (activeLiveBid) {
      localStorage.setItem('suc_active_live_bid', JSON.stringify(activeLiveBid));
    } else {
      localStorage.removeItem('suc_active_live_bid');
    }
  }, [activeLiveBid]);

  // Real-time synchronization with server /api/live-bid and BroadcastChannel across tabs/devices
  useEffect(() => {
    let isMounted = true;

    const fetchLiveBidState = async () => {
      try {
        const res = await fetch('/api/live-bid');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data) {
            if (data.activeBid !== undefined) {
              setActiveLiveBid((current) => {
                if (!data.activeBid) return null;
                if (!current) return data.activeBid;
                // If server bid has higher amount, changed bidder, or different status/item, sync
                if (
                  data.activeBid.currentBid !== current.currentBid ||
                  data.activeBid.currentBidderTeam !== current.currentBidderTeam ||
                  data.activeBid.status !== current.status ||
                  data.activeBid.itemId !== current.itemId
                ) {
                  return data.activeBid;
                }
                return current;
              });
            }
            if (Array.isArray(data.auctionItems) && data.auctionItems.length > 0) {
              setAuctionItems((prev) => {
                const hasDifferences = data.auctionItems.some((serverItem: AuctionItem) => {
                  const local = prev.find((i) => i.id === serverItem.id);
                  return !local || local.status !== serverItem.status || local.soldToTeam !== serverItem.soldToTeam;
                });
                return hasDifferences ? data.auctionItems : prev;
              });
            }
          }
        }
      } catch {
        // network resilient
      }
    };

    fetchLiveBidState();
    const pollInterval = setInterval(fetchLiveBidState, 1500);

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('suc_live_bid_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'LIVE_BID_UPDATED') {
            fetchLiveBidState();
          }
        };
      } catch {}
    }

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      if (bc) bc.close();
    };
  }, []);

  // Live Timer Countdown Effect for Real-Time Bidding Arena
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeLiveBid && activeLiveBid.status === 'bidding' && activeLiveBid.isRunning) {
      interval = setInterval(() => {
        setActiveLiveBid((prev) => {
          if (!prev) return null;
          if (prev.remainingSeconds <= 1) {
            // Timer expired: automatically conclude the bid
            if (prev.currentBidderTeam) {
              handleConcludeBidAsSold(prev.itemId, prev.currentBidderTeam, prev.currentBid);
              return {
                ...prev,
                remainingSeconds: 0,
                isRunning: false,
                status: 'sold',
                winnerTeam: prev.currentBidderTeam,
                winningPrice: prev.currentBid,
              };
            } else {
              return {
                ...prev,
                remainingSeconds: 0,
                isRunning: false,
                status: 'passed',
              };
            }
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeLiveBid?.status, activeLiveBid?.isRunning]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    // If admin logged in, sync teams from storage immediately and open live bid
    if (session.role === 'admin') {
      syncTeamsFromStorage();
      setActiveTab('live-bid');
    } else {
      setActiveTab('live-bid');
    }
  };

  const handleLogout = () => {
    setUserSession({ isLoggedIn: false, email: '', role: 'guest' });
    setIsAdminOpen(false);
    setActiveTab('home');
  };

  const handleRegisterTeam = async (newTeam: RegisteredTeam, session?: UserSession) => {
    // Check if another team already exists with this leader email
    const emailToCheck = newTeam.leaderEmail.trim().toLowerCase();
    const existingWithSameEmail = registeredTeams.find(
      (t) => t.id !== newTeam.id && t.leaderEmail.trim().toLowerCase() === emailToCheck
    );
    if (existingWithSameEmail) {
      alert(`A team ("${existingWithSameEmail.teamName}") is already registered under the email address ${newTeam.leaderEmail}. Two teams cannot be registered under one email address.`);
      return;
    }

    // Registered teams strictly possess participant role (no admin perms)
    const cleanTeam: RegisteredTeam = {
      ...newTeam,
      role: 'participant',
      draftedResourceIds: [],
    };
    setDraftedItemIds([]);
    setRegisteredTeams((prev) => {
      const filtered = prev.filter(
        (t) => t.id !== cleanTeam.id && t.teamName.toLowerCase().trim() !== cleanTeam.teamName.toLowerCase().trim()
      );
      const updated = [cleanTeam, ...filtered];
      try {
        localStorage.setItem('suc_registered_teams', JSON.stringify(updated));
      } catch (e) {
        console.error('Storage write error', e);
      }
      return updated;
    });

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('suc_teams_sync', { detail: cleanTeam }));
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('suc_teams_channel');
        bc.postMessage({ type: 'TEAM_REGISTERED', team: cleanTeam });
        bc.close();
      } catch {}
    }

    // Persist to central server API so all devices and admin consoles update immediately
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanTeam),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.teams)) {
          setRegisteredTeams(data.teams);
          localStorage.setItem('suc_registered_teams', JSON.stringify(data.teams));
        }
      }
    } catch (err) {
      console.warn('Network sync to server API deferred:', err);
    }

    if (session) {
      setUserSession({
        ...session,
        role: 'participant',
      });
    } else {
      setUserSession({
        isLoggedIn: true,
        role: 'participant',
        email: cleanTeam.leaderEmail,
        teamName: cleanTeam.teamName,
        teamId: cleanTeam.id,
      });
    }
    setActiveTab('live-bid');
  };

  // Trial-and-error strategy sandbox toggle (purely client game simulation, does NOT affect portfolio)
  const handleToggleDraft = (item: AuctionItem) => {
    // Admin restriction: Admin must not be able to add any resource to their own team
    if (userSession.role === 'admin') {
      return;
    }

    setDraftedItemIds((prev) => {
      const isDrafted = prev.includes(item.id);
      return isDrafted ? prev.filter((id) => id !== item.id) : [...prev, item.id];
    });
  };

  const handleResetDraft = () => {
    setDraftedItemIds([]);
  };

  // Admin action: update individual resource percentage allotment (dynamically recalculates cost)
  const handleUpdateResourcePercentage = (itemId: string, newPercentage: number) => {
    const validPct = Math.max(0.1, Number(newPercentage.toFixed(2)));
    setAuctionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              percentage: validPct,
              startingPrice: Math.round((overallBudget * validPct) / 100),
            }
          : item
      )
    );
  };

  // Admin action: update individual resource valuation / starting budget (dynamically updates percentage)
  const handleUpdateResourceStartingPrice = (itemId: string, newPrice: number) => {
    const validPrice = Math.max(100, newPrice);
    const calculatedPercentage = Number(((validPrice / overallBudget) * 100).toFixed(2));
    setAuctionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              startingPrice: validPrice,
              percentage: calculatedPercentage,
            }
          : item
      )
    );
  };

  // Conclude a bid and mark the asset as sold exclusively to the winner
  const handleConcludeBidAsSold = (itemId: string, winnerTeam: string, finalPrice: number) => {
    // 1. Mark item sold exclusively in auctionItems
    setAuctionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'sold',
              soldToTeam: winnerTeam,
              soldPrice: finalPrice,
            }
          : item
      )
    );
  };

  // Admin action: start a live bidding session
  const handleStartBid = (
    itemId: string,
    startingPrice: number,
    durationSeconds: number,
    forceReopen: boolean = false
  ) => {
    const item = auctionItems.find((i) => i.id === itemId);
    if (!item) return;

    // Strict exclusivity check: item cannot be presented again unless admin explicitly chose to re-open it
    if (item.status === 'sold' && !forceReopen) {
      alert(`Resource "${item.name}" has already been acquired exclusively by ${item.soldToTeam}. It cannot be presented again in the auction unless re-opened by an administrator.`);
      return;
    }

    // Reopen item if admin explicitly decided to
    if (item.status === 'sold' && forceReopen) {
      setAuctionItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, status: 'available', soldToTeam: undefined, soldPrice: undefined }
            : i
        )
      );
    }

    const newBidSession: ActiveLiveBid = {
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      startingPrice,
      currentBid: startingPrice,
      remainingSeconds: durationSeconds,
      totalDurationSeconds: durationSeconds,
      isRunning: true,
      status: 'bidding',
      bidsHistory: [
        {
          id: `open-${Date.now()}`,
          teamName: 'Auctioneer Floor Opening',
          amount: startingPrice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ],
    };

    setActiveLiveBid(newBidSession);

    // Sync with backend API
    fetch('/api/live-bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start_bid', session: newBidSession }),
    }).catch(() => {});

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('suc_live_bid_channel');
        bc.postMessage({ type: 'LIVE_BID_UPDATED' });
        bc.close();
      } catch {}
    }
  };

  // Place a bid during live auction with anti-spam cooldown protection
  const handlePlaceBid = (teamName: string, amount: number): { success: boolean; error?: string } => {
    if (!activeLiveBid || activeLiveBid.status !== 'bidding') {
      return { success: false, error: 'Auction is not actively accepting bids.' };
    }

    const item = auctionItems.find((i) => i.id === activeLiveBid.itemId);
    if (item?.status === 'sold') {
      return { success: false, error: 'This resource has already been sold exclusively.' };
    }

    // Anti-spam bidding cooldown check per team (3 seconds cooldown)
    const teamKey = teamName.toLowerCase().trim();
    const now = Date.now();
    const lastBidTime = lastBidTimeMap.current[teamKey] || 0;
    const cooldownMs = 3000;
    if (now - lastBidTime < cooldownMs) {
      const waitSec = Math.ceil((cooldownMs - (now - lastBidTime)) / 1000);
      return {
        success: false,
        error: `Anti-spam cooldown active: Please wait ${waitSec}s before submitting another bid for ${teamName}.`,
      };
    }

    if (amount <= activeLiveBid.currentBid) {
      return { success: false, error: `Bid must exceed current high bid of ₹${activeLiveBid.currentBid.toLocaleString()}.` };
    }

    // Verify team available budget
    const targetTeam = registeredTeams.find((t) => t.teamName.toLowerCase() === teamName.toLowerCase());
    const teamBudget = targetTeam?.fictionalBudget || overallBudget;
    const spentOnSold = auctionItems
      .filter((i) => i.status === 'sold' && i.soldToTeam?.toLowerCase() === teamName.toLowerCase())
      .reduce((sum, itm) => sum + (itm.soldPrice || itm.startingPrice), 0);
    const availableBalance = teamBudget - spentOnSold;

    if (amount > availableBalance) {
      return {
        success: false,
        error: `Team ${teamName} has only ₹${availableBalance.toLocaleString()} remaining in its treasury.`,
      };
    }

    // Record bid timestamp to prevent spamming
    lastBidTimeMap.current[teamKey] = now;

    const newLog: BidLog = {
      id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      teamName,
      amount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setActiveLiveBid((prev) => {
      if (!prev) return null;
      // Auto-extend by 10s if under 15s to allow counter-bidding
      const extension = prev.remainingSeconds < 15 ? 10 : 0;
      return {
        ...prev,
        currentBid: amount,
        currentBidderTeam: teamName,
        remainingSeconds: prev.remainingSeconds + extension,
        bidsHistory: [newLog, ...prev.bidsHistory],
      };
    });

    // Notify backend
    fetch('/api/live-bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'place_bid', teamName, amount }),
    }).catch(() => {});

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('suc_live_bid_channel');
        bc.postMessage({ type: 'LIVE_BID_UPDATED' });
        bc.close();
      } catch {}
    }

    return { success: true };
  };

  const handlePauseResumeBid = () => {
    setActiveLiveBid((prev) => {
      if (!prev) return null;
      if (prev.status === 'bidding') {
        return { ...prev, status: 'paused', isRunning: false };
      } else if (prev.status === 'paused') {
        return { ...prev, status: 'bidding', isRunning: true };
      }
      return prev;
    });

    fetch('/api/live-bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pause_resume' }),
    }).catch(() => {});

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('suc_live_bid_channel');
        bc.postMessage({ type: 'LIVE_BID_UPDATED' });
        bc.close();
      } catch {}
    }
  };

  const handleAddSeconds = (seconds: number) => {
    setActiveLiveBid((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        remainingSeconds: prev.remainingSeconds + seconds,
        totalDurationSeconds: prev.totalDurationSeconds + seconds,
      };
    });

    fetch('/api/live-bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_seconds', seconds }),
    }).catch(() => {});

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('suc_live_bid_channel');
        bc.postMessage({ type: 'LIVE_BID_UPDATED' });
        bc.close();
      } catch {}
    }
  };

  const handleEndBid = (declareWinner: boolean = true) => {
    if (!activeLiveBid) return;

    if (declareWinner && activeLiveBid.currentBidderTeam) {
      handleConcludeBidAsSold(activeLiveBid.itemId, activeLiveBid.currentBidderTeam, activeLiveBid.currentBid);
      setActiveLiveBid((prev) =>
        prev
          ? {
              ...prev,
              isRunning: false,
              status: 'sold',
              winnerTeam: prev.currentBidderTeam,
              winningPrice: prev.currentBid,
            }
          : null
      );
    } else {
      setActiveLiveBid((prev) =>
        prev
          ? {
              ...prev,
              isRunning: false,
              status: 'passed',
            }
          : null
      );
    }

    fetch('/api/live-bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'end_bid', declareWinner }),
    }).catch(() => {});

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('suc_live_bid_channel');
        bc.postMessage({ type: 'LIVE_BID_UPDATED' });
        bc.close();
      } catch {}
    }
  };

  const handleResetBid = () => {
    setActiveLiveBid(null);

    fetch('/api/live-bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset_bid' }),
    }).catch(() => {});

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('suc_live_bid_channel');
        bc.postMessage({ type: 'LIVE_BID_UPDATED' });
        bc.close();
      } catch {}
    }
  };

  // Admin action: update overall auction budget
  const handleUpdateOverallBudget = (newBudget: number) => {
    setOverallBudget(newBudget);
    // Sync all teams' fictional budget
    setRegisteredTeams((prev) =>
      prev.map((team) => ({
        ...team,
        fictionalBudget: newBudget,
      }))
    );
    // Dynamically update every resource's price according to its percentage
    setAuctionItems((prev) =>
      prev.map((item) => {
        const pct = item.percentage ?? (ITEM_BASELINE_PERCENTAGES[item.id] ?? 10);
        return {
          ...item,
          percentage: pct,
          startingPrice: Math.round((newBudget * pct) / 100),
        };
      })
    );
  };

  // Admin action: update item sold status manually (Assign or Revoke resource)
  const handleUpdateItemStatus = (itemId: string, status: 'available' | 'sold', teamName?: string, price?: number) => {
    setAuctionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status,
              soldToTeam: status === 'sold' ? teamName : undefined,
              soldPrice: status === 'sold' ? price : undefined,
            }
          : item
      )
    );

    if (status === 'sold' && teamName) {
      setRegisteredTeams((prev) =>
        prev.map((t) => {
          if (t.teamName.toLowerCase() === teamName.toLowerCase()) {
            const cur = t.draftedResourceIds || [];
            return { ...t, draftedResourceIds: cur.includes(itemId) ? cur : [...cur, itemId] };
          }
          return t;
        })
      );

      // Persist to server
      fetch('/api/live-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign_resource', itemId, teamName, price }),
      }).catch(() => {});
    } else if (status === 'available') {
      // Remove from any team that previously held it
      setRegisteredTeams((prev) =>
        prev.map((t) => ({
          ...t,
          draftedResourceIds: (t.draftedResourceIds || []).filter((id) => id !== itemId),
        }))
      );

      // Persist unassign to server
      fetch('/api/live-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unassign_resource', itemId }),
      }).catch(() => {});
    }

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('suc_live_bid_channel');
        bc.postMessage({ type: 'LIVE_BID_UPDATED' });
        bc.close();
      } catch {}
    }
  };

  // Admin action: toggle team verification status
  const handleToggleTeamStatus = async (teamId: string) => {
    setRegisteredTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, status: team.status === 'approved' ? 'pending' : 'approved' }
          : team
      )
    );
    try {
      await fetch(`/api/teams/${teamId}/status`, { method: 'PATCH' });
    } catch {}
  };

  // Admin action: reset all sold items to available
  const handleResetAuction = () => {
    setAuctionItems((prev) =>
      prev.map((item) => ({ ...item, status: 'available', soldToTeam: undefined, soldPrice: undefined }))
    );
    setRegisteredTeams((prev) =>
      prev.map((t) => ({ ...t, draftedResourceIds: [] }))
    );
    setActiveLiveBid(null);
  };

  // Admin action: delete team
  const handleDeleteTeam = async (teamId: string) => {
    setRegisteredTeams((prev) => prev.filter((t) => t.id !== teamId));
    try {
      await fetch(`/api/teams/${teamId}`, { method: 'DELETE' });
    } catch {}
  };

  // Admin action: batch import teams from JSON
  const handleImportTeams = (importedTeams: RegisteredTeam[]) => {
    setRegisteredTeams((prev) => {
      const map = new Map<string, RegisteredTeam>();
      INITIAL_REGISTERED_TEAMS.forEach((t) => map.set(t.id, t));
      prev.forEach((t) => map.set(t.id, t));
      importedTeams.forEach((t) => map.set(t.id, t));
      const merged = Array.from(map.values());
      try {
        localStorage.setItem('suc_registered_teams', JSON.stringify(merged));
      } catch {}
      return merged;
    });

    // Also attempt sending imported teams to serverless API
    importedTeams.forEach((t) => {
      fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t),
      }).catch(() => {});
    });
  };

  const totalDraftedCost = draftedItemIds.reduce((sum, id) => {
    const item = auctionItems.find((i) => i.id === id);
    return sum + (item ? item.startingPrice : 0);
  }, 0);

  const remainingBudget = overallBudget - totalDraftedCost;

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 pb-16 lg:pb-0 ${
        isDarkMode
          ? 'bg-[#080d16] text-[#e2e8f0] selection:bg-emerald-500/30 selection:text-emerald-300'
          : 'bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-800'
      }`}
    >
      {/* Top Navbar with Tab Switching (no scrolling) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
        userSession={userSession}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenBudgetSimulator={() => handleSelectTab('resources')}
        selectedItemsCount={draftedItemIds.length}
        remainingBudget={remainingBudget}
        isLiveBidActive={Boolean(activeLiveBid && activeLiveBid.status === 'bidding')}
      />

      {/* Site-wide Live Bid Alert Banner: Updates instantly for all teams when a bid has started */}
      {activeLiveBid && activeLiveBid.status === 'bidding' && (
        <aside
          aria-label="Active Live Bidding Notification"
          className="fixed top-[58px] left-0 right-0 z-40 bg-gradient-to-r from-red-600 via-emerald-700 to-red-600 text-white shadow-xl py-2 px-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/20 animate-fadeIn"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="text-xs font-['Chakra_Petch'] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded text-yellow-300">
              ROUND ACTIVE NOW
            </span>
            <span className="text-xs font-bold font-mono text-white">
              {activeLiveBid.itemName}
            </span>
            <span className="text-xs font-mono text-emerald-100 hidden sm:inline">
              • High Bid: <strong className="text-yellow-300">₹{activeLiveBid.currentBid.toLocaleString()}</strong> ({activeLiveBid.currentBidderTeam || 'Opening Floor'})
            </span>
            <span className="text-xs font-mono font-bold bg-black/50 px-2 py-0.5 rounded text-yellow-300">
              ⏱ {Math.floor(activeLiveBid.remainingSeconds / 60)}:{(activeLiveBid.remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectTab('live-bid')}
            className="px-4 py-1 rounded-md bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider shadow cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>BID IN ARENA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Main Content: Switches to the selected section based on user navigation */}
      <main className={`min-h-[calc(100vh-200px)] ${activeLiveBid && activeLiveBid.status === 'bidding' ? 'pt-8' : ''}`}>
        {activeTab === 'home' && (
          <div>
            <Hero
              onOpenRegister={() => setIsRegisterOpen(true)}
              onOpenLogin={() => setIsLoginOpen(true)}
              onNavigateTab={handleSelectTab}
              userSession={userSession}
              overallBudget={overallBudget}
              isDarkMode={isDarkMode}
            />

            {/* Quick Section Navigation Hub */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  type="button"
                  onClick={() => handleSelectTab('live-bid')}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 group hover:-translate-y-1 ${
                    isDarkMode
                      ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/60 shadow-lg'
                      : 'bg-white border-slate-200 hover:border-emerald-500/60 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Gavel className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-500 font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      LIVE FLOOR
                    </span>
                  </div>
                  <h3
                    className={`font-['Chakra_Petch'] font-bold text-xl uppercase mb-1 group-hover:text-emerald-500 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    LIVE BIDDING ARENA
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                    Timed bidding rounds, single-buyer exclusivity, and immediate auctioneer hammer declarations.
                  </p>
                  <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Enter Live Arena</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTab('resources')}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 group hover:-translate-y-1 ${
                    isDarkMode
                      ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/60 shadow-lg'
                      : 'bg-white border-slate-200 hover:border-emerald-500/60 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-500 font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      28 ASSETS
                    </span>
                  </div>
                  <h3
                    className={`font-['Chakra_Petch'] font-bold text-xl uppercase mb-1 group-hover:text-emerald-500 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    RESOURCE CATALOG
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                    Explore healthcare, clean water, energy, and digital assets. Simulate your ₹{overallBudget.toLocaleString()} portfolio.
                  </p>
                  <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Explore 28 Assets</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {userSession.role === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => handleSelectTab('portfolio')}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 group hover:-translate-y-1 cursor-pointer ${
                      isDarkMode
                        ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/60 shadow-lg'
                        : 'bg-white border-slate-200 hover:border-emerald-500/60 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <User className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                        ADMIN CONSOLE
                      </span>
                    </div>
                    <h3
                      className={`font-['Chakra_Petch'] font-bold text-xl uppercase mb-1 group-hover:text-emerald-500 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      ALL TEAM PORTFOLIOS
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                      Executive review of acquired civic resources, budget spending, and allocation rosters across all delegations.
                    </p>
                    <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Review All Portfolios</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ) : userSession.role === 'participant' ? (
                  <button
                    type="button"
                    onClick={() => handleSelectTab('portfolio')}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 group hover:-translate-y-1 cursor-pointer ${
                      isDarkMode
                        ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/60 shadow-lg'
                        : 'bg-white border-slate-200 hover:border-emerald-500/60 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        MY DELEGATION
                      </span>
                    </div>
                    <h3
                      className={`font-['Chakra_Petch'] font-bold text-xl uppercase mb-1 group-hover:text-emerald-500 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      MY TEAM PORTFOLIO
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                      Inspect your delegation's acquired civic assets, winning bid prices, remaining funds, and delegation roster.
                    </p>
                    <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>View Team Portfolio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectTab('rules')}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 group hover:-translate-y-1 cursor-pointer ${
                      isDarkMode
                        ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/60 shadow-lg'
                        : 'bg-white border-slate-200 hover:border-emerald-500/60 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Shield className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-emerald-500 font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        PROTOCOL
                      </span>
                    </div>
                    <h3
                      className={`font-['Chakra_Petch'] font-bold text-xl uppercase mb-1 group-hover:text-emerald-500 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      LEAGUE REGULATIONS
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                      Understand budget constraints, single-buyer exclusivity, and live bidding procedures before entering the arena.
                    </p>
                    <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Read Regulations</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Registration CTA on Home */}
            <RegistrationSection
              onOpenRegister={() => setIsRegisterOpen(true)}
              onOpenLogin={() => setIsLoginOpen(true)}
              userSession={userSession}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="pt-8">
            <AboutSection overallBudget={overallBudget} isDarkMode={isDarkMode} />
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="pt-8">
            <RulesSection isDarkMode={isDarkMode} />
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="pt-8">
            {userSession.isLoggedIn ? (
              <AuctionSection
                auctionItems={auctionItems}
                draftedItemIds={draftedItemIds}
                onToggleDraft={handleToggleDraft}
                onResetDraft={handleResetDraft}
                isDarkMode={isDarkMode}
                currentUserTeamName={userSession.teamName}
                overallBudget={overallBudget}
                userSession={userSession}
                onUpdateItemStartingPrice={handleUpdateResourceStartingPrice}
                registeredTeams={registeredTeams}
                onAssignResource={(itemId, teamName, price) => handleUpdateItemStatus(itemId, 'sold', teamName, price)}
                onUnassignResource={(itemId) => handleUpdateItemStatus(itemId, 'available')}
                activeLiveBidItemId={activeLiveBid && activeLiveBid.status === 'bidding' ? activeLiveBid.itemId : undefined}
                onNavigateToLiveArena={() => handleSelectTab('live-bid')}
              />
            ) : (
              <LockedAuctionTeaser
                onOpenLogin={() => setIsLoginOpen(true)}
                onOpenRegister={() => setIsRegisterOpen(true)}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        )}

        {activeTab === 'live-bid' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <LiveBidArena
              auctionItems={auctionItems}
              registeredTeams={registeredTeams}
              userSession={userSession}
              overallBudget={overallBudget}
              activeBid={activeLiveBid}
              onStartBid={handleStartBid}
              onPlaceBid={handlePlaceBid}
              onPauseResumeBid={handlePauseResumeBid}
              onAddSeconds={handleAddSeconds}
              onEndBid={handleEndBid}
              onResetBid={handleResetBid}
              onOpenLogin={() => setIsLoginOpen(true)}
              onOpenRegister={() => setIsRegisterOpen(true)}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <PortfolioSection
              registeredTeams={registeredTeams}
              auctionItems={auctionItems}
              userSession={userSession}
              overallBudget={overallBudget}
              onSelectResource={(item) => setSelectedResourceForModal(item)}
              onExploreAuction={() => handleSelectTab('live-bid')}
              onOpenLogin={() => setIsLoginOpen(true)}
              onOpenRegister={() => setIsRegisterOpen(true)}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </main>

      {/* Footer with section-switching links */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        isDarkMode={isDarkMode}
      />

      {/* Sticky Mobile Bar with tab navigation */}
      <StickyMobileRegister
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onNavigateTab={handleSelectTab}
        userSession={userSession}
        remainingBudget={remainingBudget}
        isDarkMode={isDarkMode}
      />

      {/* Full Resource Specification Modal */}
      <ResourceDetailModal
        item={selectedResourceForModal}
        onClose={() => setSelectedResourceForModal(null)}
        onSimulateBid={userSession.role === 'admin' ? undefined : (userSession.isLoggedIn ? handleToggleDraft : undefined)}
        isDrafted={selectedResourceForModal ? draftedItemIds.includes(selectedResourceForModal.id) : false}
        canAfford={selectedResourceForModal ? remainingBudget >= selectedResourceForModal.startingPrice : true}
        isDarkMode={isDarkMode}
        isAdmin={userSession.role === 'admin'}
        onUpdateStartingPrice={handleUpdateResourceStartingPrice}
      />

      {/* Registration Modal with clean confirmation (no pass created) */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterTeam}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
        isDarkMode={isDarkMode}
      />

      {/* Login Modal with Member/Admin credentials */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        registeredTeams={registeredTeams}
        isDarkMode={isDarkMode}
      />

      {/* Admin Panel for authorized event administrators */}
      {userSession.role === 'admin' && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          adminEmail={userSession.email || 'Admin'}
          registeredTeams={registeredTeams}
          auctionItems={auctionItems}
          overallBudget={overallBudget}
          onUpdateOverallBudget={handleUpdateOverallBudget}
          onUpdateItemStartingPrice={handleUpdateResourceStartingPrice}
          onToggleTeamStatus={handleToggleTeamStatus}
          onDeleteTeam={handleDeleteTeam}
          onUpdateItemStatus={handleUpdateItemStatus}
          onResetAuction={handleResetAuction}
          onRefreshTeams={syncTeamsFromStorage}
          onImportTeams={handleImportTeams}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
