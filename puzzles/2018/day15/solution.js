import { getStraightAdjacent, getDistance } from '../../utils/grid.js';
import BinaryHeap from '../../utils/binary-heap.js';

export const formatInput = input => input.split('\n').map((row, y) => row.split('').map((type, x) => {
  if (type === 'E' || type === 'G') {
    return { type, x, y, hp: 200 };
  }
  return type === '#' ? null : { empty: true };
}));

const readingOrder = (u1, u2) => {
  const dy = u1.y - u2.y;
  return dy === 0 ? u1.x - u2.x : dy;
};

const getEnemyToAttack = (field, adjacent, enemyType) => adjacent
  .map(([x, y]) => field[y][x])
  .filter(unit => unit?.type === enemyType)
  .sort((u1, u2) => {
    const hp = u1.hp - u2.hp;
    return hp === 0 ? readingOrder(u1, u2) : hp;
  })[0];

const tryToAttack = (field, counts, adjacent, enemyType, attackPower) => {
  const enemy = getEnemyToAttack(field, adjacent, enemyType);
  if (enemy) {
    if (enemy.hp > attackPower) {
      enemy.hp -= attackPower;
    } else {
      // when hp is too low - unit dies
      enemy.dead = true;
      field[enemy.y][enemy.x] = { empty: true };
      counts[enemyType] -= 1;
    }
    return true;
  }
  return false;
};

const getNextMoveLength = ([sx, sy], [fx, fy], field) => {
  const distance = getDistance([sx, sy], [fx, fy]);
  if (distance <= 1) {
    return distance;
  }
  const visited = new Set();
  const queue = new BinaryHeap(state => state.length + getDistance([state.x, state.y], [fx, fy]), state => state.hash);
  queue.push({ x: sx, y: sy, hash: `${sx},${sy}`, length: 0 });

  while (queue.size) {
    // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the enemy
    if (state.x === fx && state.y === fy) {
      return state.length;
    }

    // 3. Mark it as visited
    visited.add(state.hash);

    // 4. Find next states
    getStraightAdjacent(state.x, state.y).forEach(([x, y]) => {
      if (!field[y][x]?.empty) {
        return;
      }
      const hash = `${x},${y}`;
      if (!visited.has(hash)) {
        const nextState = { x, y, hash, length: state.length + 1 };
        if (queue.has(nextState)) {
          const queuedState = queue.get(nextState);
          if (nextState.length < queuedState.length) {
            queuedState.length = nextState.length;
            queue.reposition(queuedState);
          }
        } else {
          queue.push(nextState);
        }
      }
    });
  }
  return -1;
};

const collectUnits = field => field.flatMap(row => row.map(tile => (tile?.type ? tile : null))).filter(Boolean);

const playGame = (field, elvesAttackPower = 3) => {
  field = structuredClone(field);
  let units = collectUnits(field);
  const counts = {
    E: units.filter(({ type }) => type === 'E').length,
    G: units.filter(({ type }) => type === 'G').length,
  };
  let rounds = 0;

  while (counts.E && counts.G) {
    let fullRound = true;

    units.forEach(unit => {
      if (!counts.E || !counts.G) {
        fullRound = false;
        return;
      }

      if (unit.dead) {
        return;
      }

      const enemyType = unit.type === 'E' ? 'G' : 'E';
      const attackPower = enemyType === 'G' ? elvesAttackPower : 3;
      let adjacent = getStraightAdjacent(unit.x, unit.y);

      // First see if we can already attack
      if (tryToAttack(field, counts, adjacent, enemyType, attackPower)) {
        // ...and stop with this unit if it successfully attacked
        return;
      }

      // No enemies to attack – try to move closer
      adjacent = adjacent.filter(([x, y]) => field[y][x]?.empty);
      if (adjacent.length === 0) {
        // cannot really move as all adjacent fields are blocked
        return;
      }

      const move = units
        .flatMap(({ x, y, type, dead }) => {
          if (dead || type !== enemyType) {
            return [];
          }
          return getStraightAdjacent(x, y).flatMap(([ax, ay]) => {
            if (!field[ay][ax]?.empty) {
              return [];
            }
            return adjacent.map(adj => {
              const length = getNextMoveLength(adj, [ax, ay], field);
              return length >= 0 ? { x: ax, y: ay, length, firstMove: { x: adj[0], y: adj[1] } } : null;
            });
          });
        })
        .filter(Boolean)
        .sort((m1, m2) => {
          // sort by the "shortest path" and by the top-down, left-right rule in case of tie
          const length = m1.length - m2.length;
          if (length !== 0) {
            return length;
          }
          const targetOrder = readingOrder(m1, m2);
          return targetOrder === 0 ? readingOrder(m1.firstMove, m2.firstMove) : targetOrder;
        })[0];

      if (!move) {
        return;
      }

      // do the move
      const { x, y } = move.firstMove;
      field[unit.y][unit.x] = { empty: true };
      field[y][x] = unit;
      unit.x = x;
      unit.y = y;

      // Check if there are enemies to attack after the move
      tryToAttack(field, counts, getStraightAdjacent(unit.x, unit.y), enemyType, attackPower);
    });

    units = units.filter(({ dead }) => !dead).sort(readingOrder);
    if (fullRound) {
      rounds += 1;
    }
  }
  return { units, rounds };
};

const calcOutcome = ({ units, rounds }) => units.map(({ hp }) => hp).sum() * rounds;

export const part1 = input => calcOutcome(playGame(input));

const isWin = ({ units }, initialCount) => (units[0].type === 'E' && units.length === initialCount);

export const part2 = input => {
  const countElves = collectUnits(input).filter(({ type }) => type === 'E').length;
  let attackPower = 0;
  let appx = 10;
  let firstWin = false;

  for (;;) {
    attackPower += appx;
    const result = playGame(input, attackPower);
    if (isWin(result, countElves)) {
      firstWin = true;
      // it's a win
      if (appx === 1) {
        return calcOutcome(result);
      }
      appx = -Math.max(Math.round(Math.abs(appx) / 2), 1);
    } else {
      appx = firstWin ? Math.max(1, Math.round(Math.abs(appx) / 2)) : appx * 2;
    }
  }
};
