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

  // API Route: Delete team
  app.delete('/api/teams/:id', (req, res) => {
    const { id } = req.params;
    inMemoryTeams = loadTeams();
    inMemoryTeams = inMemoryTeams.filter((t) => t.id !== id);
    saveTeams(inMemoryTeams);
    res.json({ success: true, teams: inMemoryTeams });
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
