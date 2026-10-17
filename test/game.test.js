import test from 'node:test';
import assert from 'node:assert';
import { NexusGame } from '../src/game.js';
import { NexusBot } from '../src/bot.js';

test('NexusGame: initialization and state', () => {
  const game = new NexusGame('test_match');
  assert.strictEqual(game.status, 'waiting');
  assert.strictEqual(game.round, 1);
  assert.strictEqual(game.currentTurn, 'p1');

  game.join('human', 'Player 1');
  game.addBot('p2', 'AI Bot');
  assert.strictEqual(game.status, 'active');

  const state = game.getState();
  assert.strictEqual(state.matchId, 'test_match');
  assert.strictEqual(Object.keys(state.units).length, 6);
  assert.strictEqual(Object.keys(state.nexuses).length, 3);
});

test('NexusGame: move and attack mechanics', () => {
  const game = new NexusGame('test_combat');
  game.join('human', 'P1');
  game.addBot('p2', 'P2');

  // Move P1 unit towards center: (0, 1) -> (1, 1)
  const res = game.executeAction('p1', {
    action: 'move',
    unitId: 'p1_u1',
    targetX: 1,
    targetY: 1,
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(game.units['p1_u1'].x, 1);
  assert.strictEqual(game.units['p1_u1'].y, 1);
  assert.strictEqual(game.energy.p1, 2);
});

test('NexusBot: computes valid move', () => {
  const game = new NexusGame('test_bot');
  game.join('human', 'P1');
  game.addBot('p2', 'P2');

  // End P1 turn so it is bot's turn
  game.executeAction('p1', { action: 'end_turn' });
  assert.strictEqual(game.currentTurn, 'p2');

  const bot = new NexusBot('p2');
  const move = bot.computeMove(game.getState());
  assert.ok(move);
  assert.ok(['move', 'attack', 'capture', 'shield', 'end_turn'].includes(move.action));
});
