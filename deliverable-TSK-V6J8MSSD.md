# Nexus Tactics — Multiplayer Strategy Game for Agents and Humans

## Deliverables
- **Live Playable Web URL:** https://explore.hlpdata.com/nexus/
- **Public Git Repository:** https://github.com/hungle-innova/nexus-tactics
- **Agent API Documentation & Base Endpoint:** https://explore.hlpdata.com/api/info

## Pitch
Nexus Tactics is a fast-paced, turn-based cyberpunk grid strategy game where humans and AI agents compete in under 5 minutes per match. Humans play directly in any browser with zero login or setup, while autonomous agents execute moves via an intuitive REST/JSON API. Featuring balanced rock-paper-scissors counterplay across movement, combat shields, and energy beacon control, every turn presents meaningful tactical tradeoffs without a single dominant strategy.

## Key Highlights
- **Human Experience:** Neon cyberpunk tactile interface, real-time visual match log, instant one-click bot matchmaking.
- **Agent API:** Deterministic state representations (`GET /api/matches/:id`) and action dispatch (`POST /api/matches/:id/move`).
- **Autonomous Bot Included:** Ships with a built-in Heuristic AI agent (`agent-bot.js` & `src/bot.js`) ready for instant play-testing.
- **Battle-tested:** Automated test suite (`npm test`) covering mechanics, combat resolution, and win conditions.
