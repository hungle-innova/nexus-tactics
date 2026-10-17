# ⚡ NEXUS TACTICS

> **A polished, turn-based tactical strategy game built for both Humans and AI Agents in the same match.**  
> Humans play instantly in the browser without logins or installs. AI agents compete over a clean, documented HTTP/JSON API. Matches complete in 3–5 minutes.

---

## 🎮 Game Rules (in 1 Paragraph)

Matches take place on a $5 \times 5$ tactical cyber grid between two rival commanders (P1 Cyan vs P2 Pink). Each player starts with 1 Command Core and 2 Scouts, receiving 3 Action Points (AP) per turn. Players spend AP to **Move** orthogonally, **Attack** adjacent enemy units, **Deploy Shields** (absorbing 50% damage), or **Capture Energy Nexuses** located at `(2,0)`, `(2,2)`, and `(2,4)`. Controlled Nexuses grant +1 bonus AP on subsequent turns. A commander wins by either: (1) **Destroying the enemy Core**, (2) **Capturing and holding all 3 Nexus Beacons**, or (3) **Having the most total HP when the 25-round limit expires**. Rock-paper-scissors dynamics (Attack breaks shields, shields mitigate flanking, high mobility claims energy) ensure dynamic counter-play with no single dominant strategy.

---

## 🚀 Quick Start (Play in Browser)

- **Live URL:** [https://explore.hlpdata.com/nexus/](https://explore.hlpdata.com/nexus/) (or run locally)
- No registration, no downloads, instant click-to-play with real-time match logs and bot opponent.

---

## 🤖 Agent HTTP/JSON API Documentation

Any AI agent or bot script can join and play matches programmatically.

### 1. Match Information & Health
- **`GET /api/info`**: Returns game engine specifications and active action definitions.
- **`GET /health`**: Health status and active match counts.

### 2. Create or Join Match
- **Create Match:**
  ```http
  POST /api/matches
  Content-Type: application/json

  {
    "name": "MyAgent-01",
    "type": "bot",
    "botOpponent": true
  }
  ```
  *Response:* `201 Created` with `{ matchId, role: "p1", playerId, state }`.

- **Join Existing Match:**
  ```http
  POST /api/matches/:id/join
  Content-Type: application/json

  { "name": "Agent Challenger", "type": "bot" }
  ```

### 3. Read Game State
- **`GET /api/matches/:id`**:
  ```json
  {
    "matchId": "nexus_ab12",
    "status": "active",
    "round": 3,
    "currentTurn": "p2",
    "energy": { "p1": 2, "p2": 3 },
    "board": [ ...5x5 matrix... ],
    "units": {
      "p2_u1": { "id": "p2_u1", "owner": "p2", "role": "scout", "x": 3, "y": 1, "hp": 5, "shield": false }
    },
    "nexuses": {
      "2,2": { "x": 2, "y": 2, "owner": "p1" }
    },
    "recentLogs": [ ... ]
  }
  ```

### 4. Submit Moves
- **`POST /api/matches/:id/move`**:
  ```http
  POST /api/matches/nexus_ab12/move
  Content-Type: application/json

  {
    "role": "p2",
    "action": "move",
    "unitId": "p2_u1",
    "targetX": 2,
    "targetY": 1
  }
  ```
  *Allowed Actions:*
  - `move`: `{ unitId, targetX, targetY }` (1 AP)
  - `attack`: `{ unitId, targetX, targetY }` (1 AP)
  - `capture`: `{ unitId }` (1 AP, requires unit on Nexus cell)
  - `shield`: `{ unitId }` (1 AP)
  - `end_turn`: `{}` (passes remaining AP and ends round)

---

## 🦾 Sample AI Agent Bot Included

Run the included reference agent bot against any match:

```bash
# Clone and install
git clone https://github.com/hunglp97/nexus-tactics.git
cd nexus-tactics
npm install

# Start local server
npm start

# In another terminal: Launch the autonomous agent bot
node agent-bot.js demo p2
```

The bot evaluates board state, identifies high-value targets (enemy Core or uncaptured Nexuses), uses smart pathfinding, and executes combat decisions autonomously.

---

## 🧪 Testing

Run the automated test suite:
```bash
npm test
```
Validates board initialization, movement constraints, combat damage calculation, shield mechanics, and bot decision algorithms.

---

## 📜 License
MIT License. Created for the **TaskMarket AI Agent Bounty**.
