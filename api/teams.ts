import fs from 'fs';
import path from 'path';

interface RegisteredTeam {
  id: string;
  teamName: string;
  collegeOrDept?: string;
  memberNames: string[];
  leaderEmail: string;
  leaderPhone: string;
  password?: string;
  registeredAt: string;
  role: 'participant';
  status: 'approved' | 'pending';
  fictionalBudget?: number;
  draftedResourceIds?: string[];
}

const TMP_FILE = path.join('/tmp', 'registered_teams.json');
const LOCAL_SEED_FILE = path.join(process.cwd(), 'data', 'registered_teams.json');

function loadTeams(): RegisteredTeam[] {
  // First attempt to read from /tmp storage (updated during runtime)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read from /tmp/registered_teams.json:', err);
  }

  // Fallback to reading the seeded data file bundled with the repository
  try {
    if (fs.existsSync(LOCAL_SEED_FILE)) {
      const content = fs.readFileSync(LOCAL_SEED_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read from local data/registered_teams.json:', err);
  }

  return [];
}

function saveTeams(teams: RegisteredTeam[]) {
  // Save to /tmp (writable in Vercel Serverless environment)
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(teams, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to /tmp:', err);
  }

  // Also attempt to write to repo data file (works in local dev / non-serverless container)
  try {
    const dataDir = path.dirname(LOCAL_SEED_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_SEED_FILE, JSON.stringify(teams, null, 2), 'utf-8');
  } catch {
    // Expected to fail silently in read-only serverless filesystems
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

  const query = req.query || {};
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      // keep as string
    }
  }

  // Handle DELETE
  if (req.method === 'DELETE') {
    const teamId = query.id || (body && body.id);
    let teams = loadTeams();
    if (teamId) {
      teams = teams.filter((t) => t.id !== teamId);
      saveTeams(teams);
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true, teams });
  }

  // Handle PATCH (Toggle Status)
  if (req.method === 'PATCH' || query.action === 'status') {
    const teamId = query.id || (body && body.id);
    let teams = loadTeams();
    if (teamId) {
      teams = teams.map((t) =>
        t.id === teamId ? { ...t, status: t.status === 'approved' ? 'pending' : 'approved' } : t
      );
      saveTeams(teams);
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true, teams });
  }

  // Handle POST (Register or Update Team)
  if (req.method === 'POST') {
    const newTeam: RegisteredTeam = body;
    if (!newTeam || !newTeam.teamName) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Team name is required' });
    }

    let teams = loadTeams();
    const existingIndex = teams.findIndex(
      (t) =>
        t.id === newTeam.id ||
        (t.teamName && t.teamName.toLowerCase().trim() === newTeam.teamName.toLowerCase().trim())
    );

    if (existingIndex >= 0) {
      teams[existingIndex] = { ...teams[existingIndex], ...newTeam };
    } else {
      teams.unshift(newTeam);
    }

    saveTeams(teams);
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ success: true, team: newTeam, teams });
  }

  // Handle GET (Return all teams)
  const teams = loadTeams();
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(teams);
}
