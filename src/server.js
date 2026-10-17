// Express API Server for Nexus Tactics
// Hosts web game UI and REST API for humans & AI agents

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { NexusGame } from './game.js';
import { NexusBot } from './bot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3018;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

// In-memory match store
const matches = new Map();

// Helper to get or 404
function getMatch(req, res) {
  const match = matches.get(req.params.id);
  if (!match) {
    res.status(404).json({ error: 'Match not found' });
    return null;
  }
  return match;
}

// Auto-run bot loop if current turn belongs to a bot
function triggerBotIfNeeded(game) {
  if (game.status !== 'active') return;
  const currentRole = game.currentTurn;
  const player = game.players[currentRole];

  if (player && player.type === 'bot') {
    setTimeout(() => {
      if (game.status !== 'active' || game.currentTurn !== currentRole) return;
      const bot = new NexusBot(currentRole);
      let safetyCount = 0;

      while (game.currentTurn === currentRole && game.status === 'active' && safetyCount < 5) {
        safetyCount++;
        const move = bot.computeMove(game.getState());
        try {
          game.executeAction(currentRole, move);
          if (move.action === 'end_turn') break;
        } catch (err) {
          console.warn(`[bot] Move failed: ${err.message}. Ending turn.`);
          game.executeAction(currentRole, { action: 'end_turn' });
          break;
        }
      }
    }, 600); // 600ms delay for human visual feedback
  }
}

// API Routes
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Nexus Tactics API',
    version: '1.0.0',
    description: 'Turn-based tactical 5x5 grid strategy game for AI agents and humans',
    endpoints: {
      createMatch: 'POST /api/matches',
      listMatches: 'GET /api/matches',
      getMatch: 'GET /api/matches/:id',
      joinMatch: 'POST /api/matches/:id/join',
      makeMove: 'POST /api/matches/:id/move',
      getLogs: 'GET /api/matches/:id/logs',
    },
    rules: {
      grid: '5x5',
      maxRounds: 25,
      actions: ['move', 'attack', 'capture', 'shield', 'end_turn'],
      winConditions: ['Destroy opponent Core', 'Capture all 3 Nexuses', 'Most HP after round 25'],
    },
  });
});

app.get('/api/matches', (req, res) => {
  const list = Array.from(matches.values()).map((m) => ({
    id: m.id,
    status: m.status,
    round: m.round,
    players: m.players,
    winner: m.winner,
    createdAt: m.createdAt,
  }));
  res.json({ matches: list });
});

app.post('/api/matches', (req, res) => {
  const { name = 'Commander', type = 'human', botOpponent = true } = req.body;
  const matchId = 'nexus_' + Math.random().toString(36).substring(2, 8);
  const game = new NexusGame(matchId);

  const joinInfo = game.join(type, name);
  if (botOpponent) {
    game.addBot('p2', 'Agent Nexus v1');
  }

  matches.set(matchId, game);
  res.status(201).json({
    matchId,
    role: joinInfo.role,
    playerId: joinInfo.playerId,
    state: game.getState(),
  });
});

app.get('/api/matches/:id', (req, res) => {
  const match = getMatch(req, res);
  if (!match) return;
  res.json(match.getState());
});

app.post('/api/matches/:id/join', (req, res) => {
  const match = getMatch(req, res);
  if (!match) return;
  try {
    const { name = 'Guest Agent', type = 'human' } = req.body;
    const joinInfo = match.join(type, name);
    triggerBotIfNeeded(match);
    res.json({ success: true, ...joinInfo, state: match.getState() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/matches/:id/move', (req, res) => {
  const match = getMatch(req, res);
  if (!match) return;

  const { role, action, unitId, targetX, targetY } = req.body;
  if (!role || !action) {
    return res.status(400).json({ error: 'Missing role or action' });
  }

  try {
    const result = match.executeAction(role, { action, unitId, targetX, targetY });
    triggerBotIfNeeded(match);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/matches/:id/logs', (req, res) => {
  const match = getMatch(req, res);
  if (!match) return;
  res.json({ matchId: match.id, logs: match.matchLog });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), activeMatches: matches.size });
});

// Seed an initial demo match so any arriving player or bot can play immediately
const demoGame = new NexusGame('demo');
demoGame.join('human', 'Cadet Pilot');
demoGame.addBot('p2', 'Nexus AI Prime');
matches.set('demo', demoGame);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nexus Tactics server live on http://0.0.0.0:${PORT}`);
  console.log(`Demo match ready at: http://localhost:${PORT}/?match=demo`);
});
