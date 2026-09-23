import fs from 'fs';
import path from 'path';

interface BidLog {
  id: string;
  teamName: string;
  amount: number;
  timestamp: string;
}

interface ActiveLiveBid {
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
}

interface AuctionItem {
  id: string;
  name: string;
  category: string;
  startingPrice: number;
  status: 'available' | 'sold' | 'passed';
  soldToTeam?: string;
  soldPrice?: number;
  [key: string]: any;
}

const TMP_LIVE_BID_FILE = path.join('/tmp', 'active_live_bid.json');
const TMP_ITEMS_FILE = path.join('/tmp', 'auction_items.json');

function loadLiveBid(): ActiveLiveBid | null {
  try {
    if (fs.existsSync(TMP_LIVE_BID_FILE)) {
      const content = fs.readFileSync(TMP_LIVE_BID_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read /tmp/active_live_bid.json:', err);
  }
  return null;
}

function saveLiveBid(session: ActiveLiveBid | null) {
  try {
    if (session === null) {
      if (fs.existsSync(TMP_LIVE_BID_FILE)) {
        fs.unlinkSync(TMP_LIVE_BID_FILE);
      }
    } else {
      fs.writeFileSync(TMP_LIVE_BID_FILE, JSON.stringify(session, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Could not save live bid to /tmp:', err);
  }
}

function loadAuctionItems(): AuctionItem[] | null {
  try {
    if (fs.existsSync(TMP_ITEMS_FILE)) {
      const content = fs.readFileSync(TMP_ITEMS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read /tmp/auction_items.json:', err);
  }
  return null;
}

function saveAuctionItems(items: AuctionItem[]) {
  try {
    fs.writeFileSync(TMP_ITEMS_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not save auction items to /tmp:', err);
  }
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      // keep as string
    }
  }

  // GET: Return current live bid session and items
  if (req.method === 'GET') {
    const activeBid = loadLiveBid();
    const auctionItems = loadAuctionItems();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      activeBid,
      auctionItems,
      serverTime: Date.now(),
    });
  }

  // POST: Execute live auction actions
  if (req.method === 'POST') {
    const action = body?.action;
    let activeBid = loadLiveBid();
    let auctionItems = loadAuctionItems() || [];

    if (action === 'start_bid') {
      const session: ActiveLiveBid = body.session;
      if (session) {
        activeBid = session;
        saveLiveBid(activeBid);
      }
      if (Array.isArray(body.items)) {
        auctionItems = body.items;
        saveAuctionItems(auctionItems);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, activeBid, auctionItems });
    }

    if (action === 'place_bid') {
      const { teamName, amount } = body;
      if (!activeBid || activeBid.status !== 'bidding') {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'No active bidding session in progress.' });
      }

      if (amount <= activeBid.currentBid) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({
          error: `Bid must be higher than current highest bid of ₹${activeBid.currentBid.toLocaleString()}.`,
        });
      }

      // Auto-extend by 10 seconds if under 15 seconds remaining
      const extension = activeBid.remainingSeconds < 15 ? 10 : 0;
      const newLog: BidLog = {
        id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        teamName,
        amount,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };

      activeBid.currentBid = amount;
      activeBid.currentBidderTeam = teamName;
      activeBid.remainingSeconds += extension;
      activeBid.totalDurationSeconds += extension;
      activeBid.bidsHistory = [newLog, ...(activeBid.bidsHistory || [])];

      saveLiveBid(activeBid);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, activeBid });
    }

    if (action === 'pause_resume') {
      if (activeBid) {
        if (activeBid.status === 'bidding') {
          activeBid.status = 'paused';
          activeBid.isRunning = false;
        } else if (activeBid.status === 'paused') {
          activeBid.status = 'bidding';
          activeBid.isRunning = true;
        }
        saveLiveBid(activeBid);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, activeBid });
    }

    if (action === 'add_seconds') {
      const seconds = Number(body.seconds) || 15;
      if (activeBid) {
        activeBid.remainingSeconds += seconds;
        activeBid.totalDurationSeconds += seconds;
        saveLiveBid(activeBid);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, activeBid });
    }

    if (action === 'end_bid') {
      const declareWinner = body.declareWinner !== false;
      if (activeBid) {
        activeBid.isRunning = false;
        if (declareWinner && activeBid.currentBidderTeam) {
          activeBid.status = 'sold';
          // Mark item in auctionItems
          if (auctionItems && auctionItems.length > 0) {
            auctionItems = auctionItems.map((itm) =>
              itm.id === activeBid!.itemId
                ? {
                    ...itm,
                    status: 'sold' as const,
                    soldToTeam: activeBid!.currentBidderTeam,
                    soldPrice: activeBid!.currentBid,
                  }
                : itm
            );
            saveAuctionItems(auctionItems);
          }
        } else {
          activeBid.status = 'passed';
        }
        saveLiveBid(activeBid);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, activeBid, auctionItems });
    }

    if (action === 'reset_bid') {
      saveLiveBid(null);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, activeBid: null });
    }

    if (action === 'sync_items') {
      if (Array.isArray(body.items)) {
        auctionItems = body.items;
        saveAuctionItems(auctionItems);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, auctionItems });
    }

    if (action === 'assign_resource') {
      const { itemId, teamName, price } = body;
      if (itemId && teamName && auctionItems) {
        auctionItems = auctionItems.map((itm) =>
          itm.id === itemId
            ? {
                ...itm,
                status: 'sold' as const,
                soldToTeam: teamName,
                soldPrice: Number(price) || itm.startingPrice,
              }
            : itm
        );
        saveAuctionItems(auctionItems);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, auctionItems });
    }

    if (action === 'unassign_resource') {
      const { itemId } = body;
      if (itemId && auctionItems) {
        auctionItems = auctionItems.map((itm) =>
          itm.id === itemId
            ? {
                ...itm,
                status: 'available' as const,
                soldToTeam: undefined,
                soldPrice: undefined,
              }
            : itm
        );
        saveAuctionItems(auctionItems);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, auctionItems });
    }
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(400).json({ error: 'Unsupported request.' });
}
