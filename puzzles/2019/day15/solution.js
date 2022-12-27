import Intcode from '../intcode.js';

export const formatInput = input => input;

const getDroidMoves = (x, y) => [
  [x, y - 1, 1],
  [x, y + 1, 2],
  [x - 1, y, 3],
  [x + 1, y, 4],
];

const navigateDroidToOxygenSystem = input => {
  const queue = [{
    x: 0,
    y: 0,
    path: new Set(['0,0']),
    droid: new Intcode(input, { autoRun: false }),
  }];

  while (queue.length) {
    const state = queue.shift();
    for (let [x, y, command] of getDroidMoves(state.x, state.y)) {
      const hash = `${x},${y}`;
      if (state.path.has(hash)) {
        continue;
      }

      const droid = state.droid.clone();
      const status = droid.run(command).lastOutput;
      if (status === 2) {
        // Found the oxygen system
        return { droid, commandsCount: state.path.size };
      }
      if (status === 1) {
        // Moved in this direction
        queue.push({ x, y, droid, path: new Set([...state.path, hash]) });
      }
    }
  }
  return null;
};

export const part1 = input => navigateDroidToOxygenSystem(input).commandsCount;

export const part2 = input => {
  const filled = new Set();
  let queue = [[0, 0, navigateDroidToOxygenSystem(input).droid]];
  let minutes = -1;

  while (queue.length) {
    minutes += 1;

    // fill with oxygen
    const nextQueue = new Map();
    queue.forEach(([ix, iy, droid]) => {
      filled.add(`${ix},${iy}`);

      getDroidMoves(ix, iy).forEach(([x, y, command]) => {
        const hash = `${x},${y}`;
        if (nextQueue.has(hash) || filled.has(hash)) {
          return;
        }
        const clone = droid.clone();
        if (clone.run(command).lastOutput > 0) {
          nextQueue.set(hash, [x, y, clone]);
        }
      });
    });
    queue = Array.from(nextQueue.values());
  }
  return minutes;
};
