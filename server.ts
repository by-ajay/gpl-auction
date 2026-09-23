import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.join(process.cwd(), 'data');
const TEAMS_FILE = path.join(DATA_DIR, 'registered_teams.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced with disk file
function loadTeams(): any[] {
  try {
    if (fs.existsSync(TEAMS_FILE)) {
      const content = fs.readFileSync(TEAMS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading teams file:', err);
  }
  return [];
}

function saveTeams(teams: any[]) {
  try {
    fs.writeFileSync(TEAMS_FILE, JSON.stringify(teams, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing teams file:', err);
  }
}

let inMemoryTeams = loadTeams();

async function start() {
  const app = express();
  app.use(express.json());

  // API Route: Get all registered teams
  app.get('/api/teams', (_req, res) => {
    // Reload from file to ensure fresh state
    inMemoryTeams = loadTeams();
    res.json(inMemoryTeams);
  });

  // API Route: Register / Add a team
  app.post('/api/teams', (req, res) => {
    const newTeam = req.body;
    if (!newTeam || !newTeam.teamName) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    inMemoryTeams = loadTeams();

    // Check duplicate email address (strictly one team per email)
    const normalizedEmail = newTeam.leaderEmail?.trim().toLowerCase();
    if (normalizedEmail) {
      const emailConflict = inMemoryTeams.find(
        (t) =>
          t.id !== newTeam.id &&
          t.leaderEmail &&
          t.leaderEmail.trim().toLowerCase() === normalizedEmail
      );
      if (emailConflict) {
        return res.status(400).json({
          error: `A team is already registered under ${newTeam.leaderEmail}. Two teams cannot be created under one email address.`,
        });
      }
    }

    // Check if team already exists by ID or team name (case-insensitive)
    const existingIndex = inMemoryTeams.findIndex(
      (t) =>
        t.id === newTeam.id ||
        (t.teamName && t.teamName.toLowerCase().trim() === newTeam.teamName.toLowerCase().trim())
    );

    if (existingIndex >= 0) {
      inMemoryTeams[existingIndex] = { ...inMemoryTeams[existingIndex], ...newTeam };
    } else {
      inMemoryTeams.unshift(newTeam);
    }

    saveTeams(inMemoryTeams);
    res.status(201).json({ success: true, team: newTeam, teams: inMemoryTeams });
  });

  // API Route: Toggle team status
  app.patch('/api/teams/:id/status', (req, res) => {
    const { id } = req.params;
    inMemoryTeams = loadTeams();
    inMemoryTeams = inMemoryTeams.map((t) =>
      t.id === id ? { ...t, status: t.status === 'approved' ? 'pending' : 'approved' } : t
    );
    saveTeams(inMemoryTeams);
    res.json({ success: true, teams: inMemoryTeams });
  });

  app.patch('/api/teams', (req, res) => {
    const id = (req.query.id as string) || req.body?.id;
    inMemoryTeams = loadTeams();
    if (id) {
      inMemoryTeams = inMemoryTeams.map((t) =>
        t.id === id ? { ...t, status: t.status === 'approved' ? 'pending' : 'approved' } : t
      );
      saveTeams(inMemoryTeams);
    }
    res.json({ success: true, teams: inMemoryTeams });
  });

  // API Route: Delete team
  app.delete('/api/teams/:id', (req, res) => {
    const { id } = req.params;
    inMemoryTeams = loadTeams();
    inMemoryTeams = inMemoryTeams.filter((t) => t.id !== id);
    saveTeams(inMemoryTeams);
    res.json({ success: true, teams: inMemoryTeams });
  });

  app.delete('/api/teams', (req, res) => {
    const id = (req.query.id as string) || req.body?.id;
    inMemoryTeams = loadTeams();
    if (id) {
      inMemoryTeams = inMemoryTeams.filter((t) => t.id !== id);
      saveTeams(inMemoryTeams);
    }
    res.json({ success: true, teams: inMemoryTeams });
  });

  // In-memory live bid session and auction items cache
  let inMemoryLiveBid: any = null;
  let inMemoryAuctionItems: any[] = [];

  // API Route: Get live bid status and items
  app.get('/api/live-bid', (_req, res) => {
    res.json({
      activeBid: inMemoryLiveBid,
      auctionItems: inMemoryAuctionItems,
      serverTime: Date.now(),
    });
  });

  // API Route: Live bidding actions & resource assignments
  app.post('/api/live-bid', (req, res) => {
    const { action, session, items, teamName, amount, seconds, declareWinner, itemId, price } = req.body;

    if (action === 'start_bid') {
      inMemoryLiveBid = session;
      if (Array.isArray(items)) {
        inMemoryAuctionItems = items;
      }
      return res.json({ success: true, activeBid: inMemoryLiveBid, auctionItems: inMemoryAuctionItems });
    }

    if (action === 'place_bid') {
      if (!inMemoryLiveBid || inMemoryLiveBid.status !== 'bidding') {
        return res.status(400).json({ error: 'No active bidding session in progress.' });
      }

      if (amount <= inMemoryLiveBid.currentBid) {
        return res.status(400).json({
          error: `Bid must be higher than current highest bid of ₹${inMemoryLiveBid.currentBid.toLocaleString()}.`,
        });
      }

      const extension = inMemoryLiveBid.remainingSeconds < 15 ? 10 : 0;
      const newLog = {
        id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        teamName,
        amount,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };

      inMemoryLiveBid.currentBid = amount;
      inMemoryLiveBid.currentBidderTeam = teamName;
      inMemoryLiveBid.remainingSeconds += extension;
      inMemoryLiveBid.totalDurationSeconds += extension;
      inMemoryLiveBid.bidsHistory = [newLog, ...(inMemoryLiveBid.bidsHistory || [])];

      return res.json({ success: true, activeBid: inMemoryLiveBid });
    }

    if (action === 'pause_resume') {
      if (inMemoryLiveBid) {
        if (inMemoryLiveBid.status === 'bidding') {
          inMemoryLiveBid.status = 'paused';
          inMemoryLiveBid.isRunning = false;
        } else if (inMemoryLiveBid.status === 'paused') {
          inMemoryLiveBid.status = 'bidding';
          inMemoryLiveBid.isRunning = true;
        }
      }
      return res.json({ success: true, activeBid: inMemoryLiveBid });
    }

    if (action === 'add_seconds') {
      const sec = Number(seconds) || 15;
      if (inMemoryLiveBid) {
        inMemoryLiveBid.remainingSeconds += sec;
        inMemoryLiveBid.totalDurationSeconds += sec;
      }
      return res.json({ success: true, activeBid: inMemoryLiveBid });
    }

    if (action === 'end_bid') {
      const isWinner = declareWinner !== false;
      if (inMemoryLiveBid) {
        inMemoryLiveBid.isRunning = false;
        if (isWinner && inMemoryLiveBid.currentBidderTeam) {
          inMemoryLiveBid.status = 'sold';
          if (inMemoryAuctionItems.length > 0) {
            inMemoryAuctionItems = inMemoryAuctionItems.map((itm) =>
              itm.id === inMemoryLiveBid.itemId
                ? {
                    ...itm,
                    status: 'sold',
                    soldToTeam: inMemoryLiveBid.currentBidderTeam,
                    soldPrice: inMemoryLiveBid.currentBid,
                  }
                : itm
            );
          }
        } else {
          inMemoryLiveBid.status = 'passed';
        }
      }
      return res.json({ success: true, activeBid: inMemoryLiveBid, auctionItems: inMemoryAuctionItems });
    }

    if (action === 'reset_bid') {
      inMemoryLiveBid = null;
      return res.json({ success: true, activeBid: null });
    }

    if (action === 'sync_items') {
      if (Array.isArray(items)) {
        inMemoryAuctionItems = items;
      }
      return res.json({ success: true, auctionItems: inMemoryAuctionItems });
    }

    if (action === 'assign_resource') {
      if (itemId && teamName) {
        inMemoryAuctionItems = inMemoryAuctionItems.map((itm) =>
          itm.id === itemId
            ? {
                ...itm,
                status: 'sold',
                soldToTeam: teamName,
                soldPrice: Number(price) || itm.startingPrice,
              }
            : itm
        );
      }
      return res.json({ success: true, auctionItems: inMemoryAuctionItems });
    }

    if (action === 'unassign_resource') {
      if (itemId) {
        inMemoryAuctionItems = inMemoryAuctionItems.map((itm) =>
          itm.id === itemId
            ? {
                ...itm,
                status: 'available',
                soldToTeam: undefined,
                soldPrice: undefined,
              }
            : itm
        );
      }
      return res.json({ success: true, auctionItems: inMemoryAuctionItems });
    }

    res.status(400).json({ error: 'Unknown action.' });
  });

  // Vite development middlewares or static production serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const htmlPath = path.resolve(process.cwd(), 'index.html');
        if (fs.existsSync(htmlPath)) {
          let template = fs.readFileSync(htmlPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        }
        next();
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
