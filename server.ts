/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_SENATE_RACES,
  INITIAL_GOVERNOR_RACES,
  INITIAL_HOUSE_DISTRICTS,
  INITIAL_NEWS_ARTICLES,
  INITIAL_TIMELINE_EVENTS,
  US_STATES_METADATA,
  calculateNationalOverview
} from './src/data/election2026Data.js';
import { AdminConfig, SenateRace, GovernorRace, HouseDistrict } from './src/types/election.js';
import { cmsDb, CMSSettings, UserRole } from './src/db/cmsDatabase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Simulation state cache
let currentSenateRaces: SenateRace[] = JSON.parse(JSON.stringify(INITIAL_SENATE_RACES));
let currentGovernorRaces: GovernorRace[] = JSON.parse(JSON.stringify(INITIAL_GOVERNOR_RACES));
let currentHouseDistricts: HouseDistrict[] = JSON.parse(JSON.stringify(INITIAL_HOUSE_DISTRICTS));
let lastCacheUpdate = Date.now();

// Server-side Gemini AI Client
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Helper to simulate live vote progression
function updateSimulationState(progressPct: number) {
  const settings = cmsDb.getSettings();
  const isSim = settings.simulation.mode === 'live_simulation' || settings.forcedElectionDayMode;
  if (!isSim || progressPct <= 0) {
    currentSenateRaces = JSON.parse(JSON.stringify(INITIAL_SENATE_RACES));
    currentGovernorRaces = JSON.parse(JSON.stringify(INITIAL_GOVERNOR_RACES));
    currentHouseDistricts = JSON.parse(JSON.stringify(INITIAL_HOUSE_DISTRICTS));
    return;
  }

  // Update Senate races
  currentSenateRaces = INITIAL_SENATE_RACES.map((race, idx) => {
    const copy = JSON.parse(JSON.stringify(race)) as SenateRace;
    const stateThreshold = (idx / INITIAL_SENATE_RACES.length) * 100;
    const reporting = Math.min(100, Math.max(0, Math.round((progressPct - stateThreshold * 0.4) * 1.6)));

    copy.precinctsReportingPct = reporting;
    if (reporting > 0) {
      const baseVotes = 1200000 + (idx * 140000);
      copy.totalVotes = Math.round((reporting / 100) * baseVotes);

      const demBase = copy.keyRace ? 0.49 : 0.46 + ((idx % 3) * 0.05);
      const repBase = 1 - demBase - 0.02;

      copy.candidates[0].votes = Math.round(copy.totalVotes * (copy.candidates[0].party === 'DEM' ? demBase : repBase));
      copy.candidates[1].votes = Math.round(copy.totalVotes * (copy.candidates[1].party === 'DEM' ? demBase : repBase));
      if (copy.candidates[2]) {
        copy.candidates[2].votes = Math.max(0, copy.totalVotes - copy.candidates[0].votes - copy.candidates[1].votes);
      }

      copy.candidates.forEach((c) => {
        c.votePercentage = copy.totalVotes > 0 ? Number(((c.votes / copy.totalVotes) * 100).toFixed(1)) : 0;
      });

      if (reporting >= 90) {
        const winner = copy.candidates.reduce((prev, curr) => (curr.votes > prev.votes ? curr : prev));
        copy.status = winner.party === 'DEM' ? 'called_dem' : winner.party === 'REP' ? 'called_rep' : 'called_ind';
        copy.winnerParty = winner.party;
        winner.isWinner = true;
        copy.raceCallDetails = {
          calledBy: 'Decision Desk HQ / Associated Press',
          calledAt: new Date().toISOString(),
          confidence: reporting >= 98 ? 'certified' : 'projected'
        };
      } else if (reporting > 0) {
        copy.status = copy.keyRace && Math.abs(copy.candidates[0].votes - copy.candidates[1].votes) < copy.totalVotes * 0.02
          ? 'too_close_to_call'
          : 'reporting';
      }
    }
    copy.lastUpdated = new Date().toISOString();
    return copy;
  });

  // Update Governor races
  currentGovernorRaces = INITIAL_GOVERNOR_RACES.map((race, idx) => {
    const copy = JSON.parse(JSON.stringify(race)) as GovernorRace;
    const reporting = Math.min(100, Math.max(0, Math.round((progressPct - (idx / INITIAL_GOVERNOR_RACES.length) * 30) * 1.5)));
    copy.precinctsReportingPct = reporting;

    if (reporting > 0) {
      const baseVotes = 2400000 + (idx * 200000);
      copy.totalVotes = Math.round((reporting / 100) * baseVotes);
      const demShare = race.isCompetitive ? 0.495 : (idx % 2 === 0 ? 0.54 : 0.44);
      copy.candidates[0].votes = Math.round(copy.totalVotes * (copy.candidates[0].party === 'DEM' ? demShare : 1 - demShare));
      copy.candidates[1].votes = copy.totalVotes - copy.candidates[0].votes;
      copy.candidates.forEach((c) => {
        c.votePercentage = copy.totalVotes > 0 ? Number(((c.votes / copy.totalVotes) * 100).toFixed(1)) : 0;
      });

      if (reporting >= 92) {
        const winner = copy.candidates[0].votes > copy.candidates[1].votes ? copy.candidates[0] : copy.candidates[1];
        copy.status = winner.party === 'DEM' ? 'called_dem' : 'called_rep';
        copy.winnerParty = winner.party;
        winner.isWinner = true;
        copy.raceCallDetails = {
          calledBy: 'Decision Desk HQ / Associated Press',
          calledAt: new Date().toISOString(),
          confidence: reporting >= 98 ? 'certified' : 'projected'
        };
      } else {
        copy.status = 'reporting';
      }
    }
    copy.lastUpdated = new Date().toISOString();
    return copy;
  });

  // Update House districts
  currentHouseDistricts = INITIAL_HOUSE_DISTRICTS.map((district, idx) => {
    const copy = JSON.parse(JSON.stringify(district)) as HouseDistrict;
    const reporting = Math.min(100, Math.max(0, Math.round((progressPct - (idx * 5)) * 1.4)));
    copy.precinctsReportingPct = reporting;

    if (reporting > 0) {
      copy.totalVotes = Math.round((reporting / 100) * 320000);
      const demShare = 0.49 + ((idx % 4) * 0.01);
      copy.candidates[0].votes = Math.round(copy.totalVotes * (copy.candidates[0].party === 'DEM' ? demShare : 1 - demShare));
      copy.candidates[1].votes = copy.totalVotes - copy.candidates[0].votes;
      copy.candidates.forEach((c) => {
        c.votePercentage = copy.totalVotes > 0 ? Number(((c.votes / copy.totalVotes) * 100).toFixed(1)) : 0;
      });

      if (reporting >= 90) {
        const winner = copy.candidates[0].votes > copy.candidates[1].votes ? copy.candidates[0] : copy.candidates[1];
        copy.status = winner.party === 'DEM' ? 'called_dem' : 'called_rep';
        copy.winnerParty = winner.party;
        winner.isWinner = true;
        copy.raceCallDetails = {
          calledBy: 'Decision Desk HQ / Associated Press',
          calledAt: new Date().toISOString(),
          confidence: reporting >= 98 ? 'certified' : 'projected'
        };
      } else {
        copy.status = 'reporting';
      }
    }
    copy.lastUpdated = new Date().toISOString();
    return copy;
  });

  lastCacheUpdate = Date.now();
}

// -----------------------------------------------------------------------------
// CMS Security & Authorization Middleware
// -----------------------------------------------------------------------------
function requireCMSAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : (req.headers['x-cms-token'] as string);

  const session = cmsDb.validateSession(token);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized: valid CMS session required' });
  }

  (req as any).cmsUser = session;
  next();
}

// -----------------------------------------------------------------------------
// Public Endpoints
// -----------------------------------------------------------------------------

// GET /api/public/config: Returns synced public settings for client visitors
app.get('/api/public/config', (req: Request, res: Response) => {
  const settings = cmsDb.getSettings();
  const targetTime = new Date(settings.countdownTargetISO).getTime();
  const now = Date.now();
  const isExpired = now >= targetTime;
  const shouldOpenElectionDayDesk = (isExpired || settings.forcedElectionDayMode) && settings.autoOpenElectionDayDesk;

  res.json({
    success: true,
    countdownTargetISO: settings.countdownTargetISO,
    targetDescription: settings.targetDescription,
    isExpired,
    forcedElectionDayMode: settings.forcedElectionDayMode,
    autoOpenElectionDayDesk: settings.autoOpenElectionDayDesk,
    shouldOpenElectionDayDesk,
    broadcastTitle: settings.broadcastTitle,
    broadcastDescription: settings.broadcastDescription,
    breakingAnnouncement: settings.breakingAnnouncement,
    youtubeVideoId: settings.youtubeVideoId,
    youtubeAutoPlay: settings.youtubeAutoPlay,
    audio: settings.audio,
    layouts: settings.layouts,
    simulationProgressPct: settings.simulation.progressPct,
    activeProvider: settings.simulation.activeProvider,
    pollingIntervalSeconds: settings.simulation.pollingIntervalSeconds,
    timestamp: new Date().toISOString()
  });
});

// GET /api/elections/overview
app.get('/api/elections/overview', (req: Request, res: Response) => {
  const settings = cmsDb.getSettings();
  const isSimulation = settings.simulation.mode === 'live_simulation' || settings.forcedElectionDayMode;
  const overview = calculateNationalOverview(
    currentSenateRaces,
    currentHouseDistricts,
    currentGovernorRaces,
    isSimulation,
    settings.simulation.progressPct
  );
  res.json({
    success: true,
    data: overview,
    attribution: 'Decision Desk National Feed & State Authorities',
    cachedAt: new Date(lastCacheUpdate).toISOString()
  });
});

// GET /api/elections/senate
app.get('/api/elections/senate', (req: Request, res: Response) => {
  res.json({
    success: true,
    totalRaces: currentSenateRaces.length,
    races: currentSenateRaces,
    attribution: 'Associated Press / State Election Board Data Feed',
    timestamp: new Date().toISOString()
  });
});

// GET /api/elections/house
app.get('/api/elections/house', (req: Request, res: Response) => {
  res.json({
    success: true,
    totalCompetitiveDistricts: currentHouseDistricts.length,
    districts: currentHouseDistricts,
    attribution: 'FEC & State Tabulation Returns',
    timestamp: new Date().toISOString()
  });
});

// GET /api/elections/governors
app.get('/api/elections/governors', (req: Request, res: Response) => {
  res.json({
    success: true,
    totalRaces: currentGovernorRaces.length,
    races: currentGovernorRaces,
    attribution: 'National Governors Association & State Boards of Elections',
    timestamp: new Date().toISOString()
  });
});

// GET /api/elections/states
app.get('/api/elections/states', (req: Request, res: Response) => {
  const statesArray = Object.values(US_STATES_METADATA).map((state) => {
    const senate = currentSenateRaces.find((s) => s.state === state.abbr);
    const gov = currentGovernorRaces.find((g) => g.state === state.abbr);
    const house = currentHouseDistricts.filter((h) => h.state === state.abbr);

    return {
      ...state,
      senateRace: senate || null,
      governorRace: gov || null,
      competitiveHouseDistricts: house
    };
  });

  res.json({
    success: true,
    states: statesArray,
    timestamp: new Date().toISOString()
  });
});

// GET /api/elections/race/:raceId
app.get('/api/elections/race/:raceId', (req: Request, res: Response) => {
  const { raceId } = req.params;
  const senate = currentSenateRaces.find((r) => r.id === raceId || r.state === raceId);
  if (senate) return res.json({ success: true, type: 'senate', race: senate });

  const gov = currentGovernorRaces.find((r) => r.id === raceId || r.state === raceId);
  if (gov) return res.json({ success: true, type: 'governor', race: gov });

  const house = currentHouseDistricts.find((r) => r.id === raceId);
  if (house) return res.json({ success: true, type: 'house', race: house });

  res.status(404).json({ success: false, error: 'Race not found' });
});

// GET /api/news/latest
app.get('/api/news/latest', (req: Request, res: Response) => {
  res.json({
    success: true,
    articles: INITIAL_NEWS_ARTICLES,
    attribution: 'Associated Press, Reuters, NPR, and Official Election Directors',
    timestamp: new Date().toISOString()
  });
});

// GET /api/news/breaking
app.get('/api/news/breaking', (req: Request, res: Response) => {
  const breaking = INITIAL_NEWS_ARTICLES.filter((a) => a.isBreaking);
  res.json({
    success: true,
    breaking,
    count: breaking.length,
    timestamp: new Date().toISOString()
  });
});

// GET /api/elections/timeline
app.get('/api/elections/timeline', (req: Request, res: Response) => {
  res.json({
    success: true,
    events: INITIAL_TIMELINE_EVENTS,
    timestamp: new Date().toISOString()
  });
});

// GET /api/admin/config - Legacy admin widget config synchronized with CMS settings
app.get('/api/admin/config', (req: Request, res: Response) => {
  const settings = cmsDb.getSettings();
  res.json({
    success: true,
    config: {
      mode: settings.simulation.mode,
      activeProvider: settings.simulation.activeProvider,
      pollingIntervalSeconds: settings.simulation.pollingIntervalSeconds,
      youtubeVideoId: settings.youtubeVideoId,
      broadcastTitle: settings.broadcastTitle,
      broadcastDescription: settings.broadcastDescription,
      enableNewsFeed: true,
      simulationProgressPct: settings.simulation.progressPct,
      hasAPCredentials: Boolean(process.env.AP_API_KEY),
      hasFECCredentials: Boolean(process.env.FEC_API_KEY)
    }
  });
});

// POST /api/admin/config - Update simulation / broadcast settings
app.post('/api/admin/config', (req: Request, res: Response) => {
  const body = req.body || {};
  const current = cmsDb.getSettings();

  const updatedSettings = cmsDb.updateSettings({
    simulation: {
      ...current.simulation,
      mode: body.mode || current.simulation.mode,
      activeProvider: body.activeProvider || current.simulation.activeProvider,
      pollingIntervalSeconds: body.pollingIntervalSeconds || current.simulation.pollingIntervalSeconds,
      progressPct: body.simulationProgressPct !== undefined ? body.simulationProgressPct : current.simulation.progressPct
    },
    youtubeVideoId: body.youtubeVideoId || current.youtubeVideoId,
    broadcastTitle: body.broadcastTitle || current.broadcastTitle,
    broadcastDescription: body.broadcastDescription || current.broadcastDescription
  }, 'admin-widget', req.ip || req.socket.remoteAddress);

  res.json({
    success: true,
    config: {
      mode: updatedSettings.simulation.mode,
      activeProvider: updatedSettings.simulation.activeProvider,
      pollingIntervalSeconds: updatedSettings.simulation.pollingIntervalSeconds,
      youtubeVideoId: updatedSettings.youtubeVideoId,
      broadcastTitle: updatedSettings.broadcastTitle,
      broadcastDescription: updatedSettings.broadcastDescription,
      enableNewsFeed: true,
      simulationProgressPct: updatedSettings.simulation.progressPct,
      hasAPCredentials: Boolean(process.env.AP_API_KEY),
      hasFECCredentials: Boolean(process.env.FEC_API_KEY)
    }
  });
});

// POST /api/ai/analyze - Gemini API Server-Side Integration
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  const { prompt, context } = req.body;

  if (!aiClient) {
    return res.json({
      success: true,
      modelUsed: 'heuristic-analyst-fallback',
      analysis: `### 2026 Midterm Landscape Assessment\n\n**Senate Battlegrounds:** Georgia (Ossoff vs. Carr), North Carolina (Tillis vs. Cooper), and Maine (Collins vs. Golden) are the central tipping-point races.\n\n**House Equilibrium:** With a narrow working majority and 30 toss-up suburban districts in California, New York, and Pennsylvania, House control will likely come down to late Pacific Coast mail-in returns.\n\n**Election Night Dynamics:** Tabulation timelines indicate East Coast polls closing will provide the first barometer of independent voter sentiment.`,
      disclaimer: 'Generated via Decision Desk Election Analytics Engine.'
    });
  }

  try {
    const systemPrompt = `You are the Chief Election Analyst for "Decision Desk 2026", an authoritative, non-partisan American television election news network (like CNN/MSNBC/ABC News Decision Desks).
Provide clear, objective, data-grounded political analysis of the 2026 Midterm Elections.
Do not invent or fabricate false final results if races are uncalled. Ground your answers in electoral history, battleground dynamics, voting trends, and constitutional rules.
Format output cleanly with clear headers, bullet points, and high journalistic rigor.`;

    const fullPrompt = `${systemPrompt}\n\nCurrent Context: ${JSON.stringify(context || {})}\n\nUser Question/Analysis Request: ${prompt || 'Provide a strategic overview of the 2026 Midterm battlegrounds and paths to majority.'}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt
    });

    res.json({
      success: true,
      modelUsed: 'gemini-3.8-flash',
      analysis: response.text || 'Analysis currently unavailable.',
      disclaimer: 'Analysis generated using Decision Desk AI & Verified Election Data.'
    });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI election analysis',
      details: err?.message || 'Server error'
    });
  }
});

// -----------------------------------------------------------------------------
// CMS Administrative Endpoints (/api/cms/*)
// -----------------------------------------------------------------------------

// GET /api/cms/auth/status
app.get('/api/cms/auth/status', (req: Request, res: Response) => {
  const isInitialized = cmsDb.isInitialized();
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-cms-token'] as string);
  const session = cmsDb.validateSession(token);

  res.json({
    success: true,
    isInitialized,
    isAuthenticated: Boolean(session),
    user: session ? { username: session.username, role: session.role } : null
  });
});

// POST /api/cms/auth/setup - First-time password setup for Upasyo2007
app.post('/api/cms/auth/setup', (req: Request, res: Response) => {
  const { password } = req.body;
  const ip = req.ip || req.socket.remoteAddress;

  if (cmsDb.isInitialized()) {
    return res.status(400).json({ success: false, error: 'Administrator credentials already initialized.' });
  }

  const result = cmsDb.setupInitialAdmin(password, ip);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  // Automatically authenticate upon initial setup
  const auth = cmsDb.authenticate('Upasyo2007', password, ip);
  res.json({
    success: true,
    message: 'Master administrator Upasyo2007 initialized successfully.',
    token: auth.token,
    user: auth.user ? { username: auth.user.username, role: auth.user.role } : null
  });
});

// POST /api/cms/auth/login
app.post('/api/cms/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  const auth = cmsDb.authenticate(username, password, ip);
  if (auth.error || !auth.user || !auth.token) {
    return res.status(401).json({ success: false, error: auth.error || 'Authentication failed' });
  }

  res.json({
    success: true,
    token: auth.token,
    user: {
      id: auth.user.id,
      username: auth.user.username,
      role: auth.user.role,
      lastLoginAt: auth.user.lastLoginAt
    }
  });
});

// POST /api/cms/auth/logout
app.post('/api/cms/auth/logout', requireCMSAuth, (req: Request, res: Response) => {
  const user = (req as any).cmsUser;
  if (user?.token) {
    cmsDb.revokeSession(user.token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/cms/settings
app.get('/api/cms/settings', requireCMSAuth, (req: Request, res: Response) => {
  const settings = cmsDb.getSettings();
  res.json({
    success: true,
    settings
  });
});

// POST /api/cms/settings
app.post('/api/cms/settings', requireCMSAuth, (req: Request, res: Response) => {
  const user = (req as any).cmsUser;
  const ip = req.ip || req.socket.remoteAddress;
  const updates = req.body;

  const current = cmsDb.getSettings();
  const updatedSettings = cmsDb.updateSettings(updates, user.username, ip);

  // If simulation settings or forced mode changed, update simulation state
  if (updates.simulation?.progressPct !== undefined || updates.forcedElectionDayMode !== undefined) {
    const progress = updates.forcedElectionDayMode ? Math.max(updates.simulation?.progressPct || 40, 40) : (updates.simulation?.progressPct ?? current.simulation.progressPct);
    updateSimulationState(progress);
  }

  res.json({
    success: true,
    settings: updatedSettings,
    message: 'CMS settings saved and broadcast successfully.'
  });
});

// GET /api/cms/audit-logs
app.get('/api/cms/audit-logs', requireCMSAuth, (req: Request, res: Response) => {
  const logs = cmsDb.getAuditLogs();
  res.json({
    success: true,
    logs
  });
});

// GET /api/cms/users
app.get('/api/cms/users', requireCMSAuth, (req: Request, res: Response) => {
  const users = cmsDb.getUsers();
  res.json({
    success: true,
    users
  });
});

// POST /api/cms/change-password
app.post('/api/cms/change-password', requireCMSAuth, (req: Request, res: Response) => {
  const user = (req as any).cmsUser;
  const ip = req.ip || req.socket.remoteAddress;
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long.' });
  }

  // Re-verify current password
  const auth = cmsDb.authenticate(user.username, currentPassword, ip);
  if (auth.error) {
    return res.status(401).json({ success: false, error: 'Current password verification failed.' });
  }

  const success = cmsDb.changePassword(user.username, newPassword, user.username, ip);
  if (!success) {
    return res.status(500).json({ success: false, error: 'Failed to update password' });
  }

  res.json({ success: true, message: 'Password updated successfully' });
});

// -----------------------------------------------------------------------------
// Vite Middleware / Static Serve
// -----------------------------------------------------------------------------
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DECISION DESK 2026] Server running at http://0.0.0.0:${PORT}`);
    console.log(`[CMS SECURE ADMIN] Admin Portal available at http://0.0.0.0:${PORT}/cms-admin`);
    console.log(`[ELECTION DAY DESK] Live Desk available at http://0.0.0.0:${PORT}/election-day-desk`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
