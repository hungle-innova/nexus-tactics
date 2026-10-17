#!/usr/bin/env node
// Standalone AI Agent Player for Nexus Tactics
// Connects to a live match over HTTP/JSON API and plays moves until game over

import { NexusBot } from './src/bot.js';

const SERVER_URL = process.env.NEXUS_SERVER_URL || 'http://localhost:3018';
const MATCH_ID = process.argv[2] || 'demo';
const ROLE = process.argv[3] || 'p2';

async function play() {
  console.log(`🤖 Agent connecting to ${SERVER_URL} for match: ${MATCH_ID} as ${ROLE}...`);
  const bot = new NexusBot(ROLE);

  while (true) {
    try {
      const res = await fetch(`${SERVER_URL}/api/matches/${MATCH_ID}`);
      if (!res.ok) {
        console.error(`Match not found: ${res.status}`);
        break;
      }
      const state = await res.json();

      if (state.status === 'finished') {
        console.log(`🏆 Game over! Winner: ${state.winner} (${state.winReason})`);
        break;
      }

      if (state.currentTurn === ROLE && state.status === 'active') {
        const move = bot.computeMove(state);
        console.log(`[Turn ${state.round}] Executing move:`, move);

        const moveRes = await fetch(`${SERVER_URL}/api/matches/${MATCH_ID}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: ROLE, ...move }),
        });
        const moveData = await moveRes.json();
        if (moveData.error) {
          console.warn(`Move rejected: ${moveData.error}`);
        }
      }

      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.error(`Agent loop error: ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

play();
