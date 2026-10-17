// Heuristic AI Bot for Nexus Tactics
// Evaluates board state and picks the best tactical move

import { GRID_SIZE } from './game.js';

export class NexusBot {
  constructor(role = 'p2') {
    this.role = role;
    this.opponent = role === 'p1' ? 'p2' : 'p1';
  }

  // Decides the best action given current game state
  computeMove(gameState) {
    if (gameState.currentTurn !== this.role || gameState.status !== 'active') {
      return { action: 'end_turn' };
    }

    const myUnits = Object.values(gameState.units).filter(
      (u) => u.owner === this.role && u.hp > 0
    );

    if (myUnits.length === 0 || gameState.energy[this.role] <= 0) {
      return { action: 'end_turn' };
    }

    // 1. Can we attack any enemy adjacent to our units?
    for (const unit of myUnits) {
      if (unit.role === 'core') continue; // Core doesn't attack
      const targets = this._getAdjacentEnemies(unit, gameState);
      if (targets.length > 0) {
        // Prioritize enemy Core, then lowest HP enemy
        targets.sort((a, b) => (a.role === 'core' ? -1 : a.hp - b.hp));
        const bestTarget = targets[0];
        return {
          action: 'attack',
          unitId: unit.id,
          targetX: bestTarget.x,
          targetY: bestTarget.y,
        };
      }
    }

    // 2. Can we capture a Nexus we are currently standing on?
    for (const unit of myUnits) {
      const nexusKey = `${unit.x},${unit.y}`;
      const nexus = gameState.nexuses[nexusKey];
      if (nexus && nexus.owner !== this.role) {
        return {
          action: 'capture',
          unitId: unit.id,
        };
      }
    }

    // 3. Move towards nearest uncaptured Nexus or enemy Core
    const uncapturedNexus = Object.values(gameState.nexuses).filter(
      (n) => n.owner !== this.role
    );

    for (const unit of myUnits) {
      if (unit.role === 'core') continue;

      let destination = null;
      if (uncapturedNexus.length > 0) {
        destination = this._getNearest(unit, uncapturedNexus);
      } else {
        destination = gameState.units[`${this.opponent}_core`];
      }

      if (destination) {
        const step = this._getStepTowards(unit, destination, gameState);
        if (step) {
          return {
            action: 'move',
            unitId: unit.id,
            targetX: step.x,
            targetY: step.y,
          };
        }
      }
    }

    // 4. If low HP and no moves, shield
    for (const unit of myUnits) {
      if (unit.hp <= 3 && !unit.shield) {
        return {
          action: 'shield',
          unitId: unit.id,
        };
      }
    }

    // Default: End turn
    return { action: 'end_turn' };
  }

  _getAdjacentEnemies(unit, state) {
    const enemies = [];
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];
    for (const d of dirs) {
      const nx = unit.x + d.dx;
      const ny = unit.y + d.dy;
      if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
        const targetId = state.board[ny]?.[nx];
        if (targetId) {
          const target = state.units[targetId];
          if (target && target.owner === this.opponent && target.hp > 0) {
            enemies.push(target);
          }
        }
      }
    }
    return enemies;
  }

  _getNearest(unit, targets) {
    let best = null;
    let minDist = Infinity;
    for (const t of targets) {
      const dist = Math.abs(unit.x - t.x) + Math.abs(unit.y - t.y);
      if (dist < minDist) {
        minDist = dist;
        best = t;
      }
    }
    return best;
  }

  _getStepTowards(unit, destination, state) {
    const dirs = [
      { dx: Math.sign(destination.x - unit.x), dy: 0 },
      { dx: 0, dy: Math.sign(destination.y - unit.y) },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    for (const d of dirs) {
      if (d.dx === 0 && d.dy === 0) continue;
      const tx = unit.x + d.dx;
      const ty = unit.y + d.dy;
      if (tx >= 0 && tx < GRID_SIZE && ty >= 0 && ty < GRID_SIZE) {
        if (!state.board[ty][tx]) {
          return { x: tx, y: ty };
        }
      }
    }
    return null;
  }
}
