export interface AuctionItem {
  id: string;
  name: string;
  startingPrice: number;
  percentage: number; // Allotted percentage of overall budget, e.g. 10 for 10%
  basePrice?: number;
  baseBudgetRatio?: number;
  category: 'Vital Infrastructure' | 'Human Welfare' | 'Environment & Ecology' | 'Civic Resilience' | 'Economy & Innovation' | 'Governance & Digital';
  impactDescription: string;
  longDescription: string;
  societalBenefit: string;
  riskIfIgnored: string;
  synergyTags: string[];
  iconName: string;
  colorAccent: string;
  status?: 'available' | 'sold';
  soldToTeam?: string;
  soldPrice?: number;
}

export interface HighlightCard {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export interface RuleStep {
  number: number;
  title: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface RegisteredTeam {
  id: string;
  teamName: string;
  collegeOrDept?: string;
  memberNames: string[];
  leaderEmail: string;
  leaderPhone: string;
  password?: string;
  registeredAt: string;
  role: 'participant' | 'admin';
  fictionalBudget?: number;
  draftedResourceIds?: string[];
  status?: 'approved' | 'pending';
}

export interface BidLog {
  id: string;
  teamName: string;
  amount: number;
  timestamp: string;
}

export interface ActiveLiveBid {
  itemId: string;
  itemName: string;
  category: string;
  startingPrice: number;
  currentBid: number;
  currentBidderTeam?: string;
  remainingSeconds: number;
  totalDurationSeconds: number;
  isRunning: boolean;
  status: 'idle' | 'bidding' | 'paused' | 'sold' | 'passed';
  bidsHistory: BidLog[];
  winnerTeam?: string;
  winningPrice?: number;
}

export interface UserSession {
  isLoggedIn: boolean;
  email: string;
  role: 'guest' | 'participant' | 'admin';
  teamName?: string;
  teamId?: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  collegeOrDept?: string;
  leaderEmail: string;
  memberCount: number;
  acquiredItems: AuctionItem[];
  totalBaseValue: number; // total portfolio value based on base price of acquired resources
  totalSpent: number; // actual spend on auctions
  remainingBudget: number;
  fictionalBudget: number;
}

export type NavigationTab = 'home' | 'about' | 'rules' | 'resources' | 'live-bid' | 'portfolio' | 'leaderboard' | 'admin';
