// Core Game Logic for Nexus Tactics
// 5x5 Grid Turn-based Tactical Game for Humans & AI Agents

export const GRID_SIZE = 5;
export const MAX_ROUNDS = 25;

export const CELL_TYPES = {
  EMPTY: 'empty',
  NEXUS: 'nexus',
};

export const NEXUS_LOCATIONS = [
  { x: 2, y: 0 },
  { x: 2, y: 2 },
  { x: 2, y: 4 },
];

export class NexusGame {
  constructor(id, options = {}) {
    this.id = id;
    this.status = 'waiting'; // 'waiting', 'active', 'finished'
    this.round = 1;
    this.currentTurn = 'p1'; // 'p1' or 'p2'
    this.energy = { p1: 3, p2: 3 };
    this.winner = null;
    this.winReason = null;
    this.createdAt = new Date().toISOString();
    this.lastActionAt = this.createdAt;

    this.players = {
      p1: { id: null, name: 'Player 1 (Human)', type: 'human', ready: false },
      p2: { id: null, name: 'Player 2 (AI Bot)', type: 'bot', ready: true },
    };

    // Board representation
    this.board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

    // Units: key by unitId
    this.units = {};
    this.nexuses = {};
    this.matchLog = [];

    this._initializeBoard();
  }

  _initializeBoard() {
    // Setup neutral Nexuses
    for (const loc of NEXUS_LOCATIONS) {
      const key = `${loc.x},${loc.y}`;
      this.nexuses[key] = {
        x: loc.x,
        y: loc.y,
        owner: null, // null, 'p1', 'p2'
      };
    }

    // P1 Units (left flank)
    this._addUnit('p1_core', 'p1', 'core', 0, 2, 10, 0);
    this._addUnit('p1_u1', 'p1', 'scout', 0, 1, 5, 2);
    this._addUnit('p1_u2', 'p1', 'scout', 0, 3, 5, 2);

    // P2 Units (right flank)
    this._addUnit('p2_core', 'p2', 'core', 4, 2, 10, 0);
    this._addUnit('p2_u1', 'p2', 'scout', 4, 1, 5, 2);
    this._addUnit('p2_u2', 'p2', 'scout', 4, 3, 5, 2);
  }

  _addUnit(id, owner, role, x, y, hp, attack) {
    const unit = {
      id,
      owner,
      role, // 'core' or 'scout'
      x,
      y,
      hp,
      maxHp: hp,
      attack,
      shield: false,
    };
    this.units[id] = unit;
    this.board[y][x] = id;
  }

  join(playerType, name = null) {
    if (!this.players.p1.id) {
      this.players.p1.id = 'player_' + Math.random().toString(36).substring(2, 9);
      this.players.p1.name = name || 'Commander Alpha';
      this.players.p1.type = playerType;
      this.players.p1.ready = true;
      if (this.players.p2.ready) this.status = 'active';
      return { role: 'p1', playerId: this.players.p1.id };
    } else if (!this.players.p2.id) {
      this.players.p2.id = 'player_' + Math.random().toString(36).substring(2, 9);
      this.players.p2.name = name || 'Commander Omega';
      this.players.p2.type = playerType;
      this.players.p2.ready = true;
      this.status = 'active';
      return { role: 'p2', playerId: this.players.p2.id };
    }
    throw new Error('Match is full');
  }

  addBot(role = 'p2', botName = 'Agent Nexus') {
    if (this.players[role].id && this.players[role].type !== 'bot') {
      throw new Error(`Seat ${role} is already taken by a human`);
    }
    this.players[role] = {
      id: 'bot_' + Math.random().toString(36).substring(2, 9),
      name: botName,
      type: 'bot',
      ready: true,
    };
    if (this.players.p1.ready && this.players.p2.ready) {
      this.status = 'active';
    }
    return this.players[role];
  }

  // Action dispatcher: move, attack, capture, shield
  executeAction(role, actionData) {
    if (this.status !== 'active') throw new Error(`Game is ${this.status}`);
    if (this.currentTurn !== role) throw new Error(`Not ${role}'s turn`);

    const { action, unitId, targetX, targetY } = actionData;

    if (action === 'end_turn') {
      this._endTurn();
      return { success: true, message: 'Turn ended' };
    }

    if (this.energy[role] < 1) {
      throw new Error('Not enough energy points (EP)');
    }

    const unit = this.units[unitId];
    if (!unit || unit.owner !== role || unit.hp <= 0) {
      throw new Error('Invalid or dead unit');
    }

    let logEntry = {
      round: this.round,
      player: role,
      action,
      unitId,
      timestamp: new Date().toISOString(),
    };

    switch (action) {
      case 'move': {
        this._moveUnit(unit, targetX, targetY);
        logEntry.target = { x: targetX, y: targetY };
        break;
      }
      case 'attack': {
        const targetUnitId = this.board[targetY]?.[targetX];
        if (!targetUnitId) throw new Error('No target at coordinates');
        const target = this.units[targetUnitId];
        if (!target || target.owner === role) throw new Error('Cannot attack friendly unit');

        const dmg = this._attackUnit(unit, target);
        logEntry.target = { unitId: targetUnitId, damage: dmg, remainingHp: target.hp };
        break;
      }
      case 'capture': {
        const nexusKey = `${unit.x},${unit.y}`;
        const nexus = this.nexuses[nexusKey];
        if (!nexus) throw new Error('Unit is not on a Nexus');
        if (nexus.owner === role) throw new Error('Nexus already controlled');
        nexus.owner = role;
        logEntry.nexus = nexusKey;
        break;
      }
      case 'shield': {
        unit.shield = true;
        logEntry.message = `${unit.id} activated defensive shield`;
        break;
      }
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    this.energy[role] -= 1;
    this.lastActionAt = new Date().toISOString();
    this.matchLog.push(logEntry);

    // Check win condition
    this._checkWinCondition();

    // Auto end turn if 0 energy left
    if (this.energy[role] <= 0 && this.status === 'active') {
      this._endTurn();
    }

    return { success: true, action: logEntry, state: this.getState() };
  }

  _moveUnit(unit, tx, ty) {
    if (tx < 0 || tx >= GRID_SIZE || ty < 0 || ty >= GRID_SIZE) {
      throw new Error('Target out of bounds');
    }
    const dist = Math.abs(unit.x - tx) + Math.abs(unit.y - ty);
    if (dist !== 1) {
      throw new Error('Move limited to 1 orthogonal step');
    }
    if (this.board[ty][tx]) {
      throw new Error('Cell is occupied');
    }

    this.board[unit.y][unit.x] = null;
    unit.x = tx;
    unit.y = ty;
    this.board[ty][tx] = unit.id;
  }

  _attackUnit(attacker, target) {
    const dist = Math.abs(attacker.x - target.x) + Math.abs(attacker.y - target.y);
    if (dist > 1) {
      throw new Error('Attack range is 1 cell');
    }

    let damage = attacker.attack || 2;
    if (target.shield) {
      damage = Math.max(1, Math.floor(damage / 2));
      target.shield = false; // Shield breaks after 1 hit
    }

    target.hp -= damage;
    if (target.hp <= 0) {
      target.hp = 0;
      this.board[target.y][target.x] = null;
    }
    return damage;
  }

  _endTurn() {
    const nextRole = this.currentTurn === 'p1' ? 'p2' : 'p1';
    if (nextRole === 'p1') {
      this.round += 1;
    }
    this.currentTurn = nextRole;

    // Reset shields for next player's units
    for (const u of Object.values(this.units)) {
      if (u.owner === nextRole) u.shield = false;
    }

    // Calculate energy bonus from captured Nexuses
    let baseEnergy = 3;
    for (const n of Object.values(this.nexuses)) {
      if (n.owner === nextRole) baseEnergy += 1;
    }
    this.energy[nextRole] = baseEnergy;

    this.matchLog.push({
      round: this.round,
      action: 'turn_started',
      player: nextRole,
      energy: baseEnergy,
      timestamp: new Date().toISOString(),
    });

    this._checkWinCondition();
  }

  _checkWinCondition() {
    // 1. Core destruction
    const p1Core = this.units['p1_core'];
    const p2Core = this.units['p2_core'];

    if (p1Core.hp <= 0) {
      this.status = 'finished';
      this.winner = 'p2';
      this.winReason = 'P1 Core Destroyed';
      return;
    }
    if (p2Core.hp <= 0) {
      this.status = 'finished';
      this.winner = 'p1';
      this.winReason = 'P2 Core Destroyed';
      return;
    }

    // 2. Control all 3 nexuses
    const owners = Object.values(this.nexuses).map((n) => n.owner);
    if (owners.every((o) => o === 'p1')) {
      this.status = 'finished';
      this.winner = 'p1';
      this.winReason = 'Conquest: All Nexuses Captured';
      return;
    }
    if (owners.every((o) => o === 'p2')) {
      this.status = 'finished';
      this.winner = 'p2';
      this.winReason = 'Conquest: All Nexuses Captured';
      return;
    }

    // 3. Max rounds reached
    if (this.round > MAX_ROUNDS) {
      this.status = 'finished';
      let p1Hp = Object.values(this.units).filter((u) => u.owner === 'p1').reduce((a, b) => a + b.hp, 0);
      let p2Hp = Object.values(this.units).filter((u) => u.owner === 'p2').reduce((a, b) => a + b.hp, 0);
      this.winner = p1Hp >= p2Hp ? 'p1' : 'p2';
      this.winReason = `Turn Limit Reached (P1 HP: ${p1Hp} vs P2 HP: ${p2Hp})`;
    }
  }

  getState() {
    return {
      matchId: this.id,
      status: this.status,
      round: this.round,
      currentTurn: this.currentTurn,
      energy: this.energy,
      winner: this.winner,
      winReason: this.winReason,
      players: this.players,
      nexuses: this.nexuses,
      units: this.units,
      board: this.board,
      recentLogs: this.matchLog.slice(-10),
    };
  }
}
