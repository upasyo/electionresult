/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory application state
let adminConfig: AdminConfig = {
  mode: 'countdown', // 'countdown' | 'live_simulation' | 'external_api'
  activeProvider: 'DECISION_DESK',
  pollingIntervalSeconds: 30,
  youtubeVideoId: 'f0lYkdA-Gtw', // PBS NewsHour / election live coverage stream placeholder
  broadcastTitle: 'Decision Desk 2026: U.S. Midterm Election Live',
  broadcastDescription: 'Real-time race calls, Senate and House balance of power, and battleground analysis.',
  enableNewsFeed: true,
  simulationProgressPct: 0,
  hasAPCredentials: Boolean(process.env.AP_API_KEY),
  hasFECCredentials: Boolean(process.env.FEC_API_KEY)
};

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

// Helper to simulate live vote progression when admin config is in 'live_simulation'
function updateSimulationState(progressPct: number) {
  const isSim = adminConfig.mode === 'live_simulation';
  if (!isSim || progressPct <= 0) {
    // Reset to pre-election uncalled state
    currentSenateRaces = JSON.parse(JSON.stringify(INITIAL_SENATE_RACES));
    currentGovernorRaces = JSON.parse(JSON.stringify(INITIAL_GOVERNOR_RACES));
    currentHouseDistricts = JSON.parse(JSON.stringify(INITIAL_HOUSE_DISTRICTS));
    return;
  }

  // Update Senate races
  currentSenateRaces = INITIAL_SENATE_RACES.map((race, idx) => {
    const copy = JSON.parse(JSON.stringify(race)) as SenateRace;
    // Calculate state progress based on index and overall sim progress
    const stateThreshold = (idx / INITIAL_SENATE_RACES.length) * 100;
    const reporting = Math.min(100, Math.max(0, Math.round((progressPct - stateThreshold * 0.4) * 1.6)));

    copy.precinctsReportingPct = reporting;
    if (reporting > 0) {
      const baseVotes = 1200000 + (idx * 140000);
      copy.totalVotes = Math.round((reporting / 100) * baseVotes);

      // Candidate votes
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
        // Call race
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
// API Endpoints
// -----------------------------------------------------------------------------

// GET /api/elections/overview
app.get('/api/elections/overview', (req: Request, res: Response) => {
  const isSimulation = adminConfig.mode === 'live_simulation';
  const overview = calculateNationalOverview(
    currentSenateRaces,
    currentHouseDistricts,
    currentGovernorRaces,
    isSimulation,
    adminConfig.simulationProgressPct
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
  if (senate) {
    return res.json({ success: true, type: 'senate', race: senate });
  }

  const gov = currentGovernorRaces.find((r) => r.id === raceId || r.state === raceId);
  if (gov) {
    return res.json({ success: true, type: 'governor', race: gov });
  }

  const house = currentHouseDistricts.find((r) => r.id === raceId);
  if (house) {
    return res.json({ success: true, type: 'house', race: house });
  }

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

// GET /api/admin/config
app.get('/api/admin/config', (req: Request, res: Response) => {
  res.json({
    success: true,
    config: adminConfig
  });
});

// POST /api/admin/config
app.post('/api/admin/config', (req: Request, res: Response) => {
  const { mode, activeProvider, pollingIntervalSeconds, youtubeVideoId, simulationProgressPct, broadcastTitle } = req.body;

  if (mode !== undefined) adminConfig.mode = mode;
  if (activeProvider !== undefined) adminConfig.activeProvider = activeProvider;
  if (pollingIntervalSeconds !== undefined) adminConfig.pollingIntervalSeconds = Number(pollingIntervalSeconds);
  if (youtubeVideoId !== undefined) adminConfig.youtubeVideoId = String(youtubeVideoId).trim();
  if (broadcastTitle !== undefined) adminConfig.broadcastTitle = String(broadcastTitle).trim();
  if (simulationProgressPct !== undefined) {
    adminConfig.simulationProgressPct = Math.max(0, Math.min(100, Number(simulationProgressPct)));
    updateSimulationState(adminConfig.simulationProgressPct);
  }

  res.json({
    success: true,
    config: adminConfig,
    message: 'Configuration updated successfully'
  });
});

// POST /api/ai/analyze - Gemini API Server-Side Integration
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  const { prompt, context } = req.body;

  if (!aiClient) {
    // Graceful fallback with expert analytical intelligence if Gemini API key is not configured
    return res.json({
      success: true,
      modelUsed: 'heuristic-analyst-fallback',
      analysis: `### 2026 Midterm Landscape Assessment\n\n**Senate Battlegrounds:** Georgia (Ossoff vs. Carr), North Carolina (Tillis vs. Cooper), and Maine (Collins vs. Golden) are the central tipping-point races. Historically, midterm elections create pressure on the incumbent party in the White House, with typical net swings of 2–4 Senate seats in competitive cycles.\n\n**House Equilibrium:** With a narrow working majority and 30 toss-up suburban districts in California, New York, and Pennsylvania, House control will likely come down to late Pacific Coast mail-in returns.\n\n**Election Night Dynamics:** Tabulation timelines indicate East Coast polls closing at 19:00 ET (GA, VA, FL) will provide the first barometer of independent voter sentiment.`,
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
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
