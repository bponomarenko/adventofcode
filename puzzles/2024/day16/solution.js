import BinaryHeap from '../../utils/binary-heap.js';
import { changeDirection, getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => {
  const grid = input.toGrid();
  let start;
  let end;
  return [
    grid.map((row, y) => row.map((char, x) => {
      if (char === 'E') {
        end = [x, y];
        return '.';
      }
      if (char === 'S') {
        start = [x, y];
        return '.';
      }
      return char;
    })),
    start,
    end,
  ];
};

const turns = [
  { deg: 0, scoreChange: 1 },
  { deg: 90, scoreChange: 1001 },
  { deg: -90, scoreChange: 1001 },
  { deg: 180, scoreChange: 2001 },
];

const findShortestPath = (grid, [sx, sy], [ex, ey]) => {
  const visited = new Set();
  const queue = new BinaryHeap(state => state.score, state => state.hash);
  queue.push({
    x: sx, y: sy, score: 0, dir: 'e', hash: `${sx},${sy},e`, path: new Set([`${sx}-${sy}`]),
  });

  let bestState;
  while (queue.size) {
    // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the exit
    if (state.x === ex && state.y === ey) {
      if (bestState && bestState.score === state.score) {
        bestState.path = bestState.path.union(state.path);
      } else if (!bestState) {
        bestState = state;
      }
      continue;
    }

    // 3. Mark it as visited
    visited.add(state.hash);

    // 3. Find next states
    turns.forEach(({ deg, scoreChange }) => {
      const dir = changeDirection(state.dir, deg);
      const [x, y] = getRelativeCoord(state.x, state.y, dir);
      const hash = `${x},${y},${dir}`;
      if (visited.has(hash) || grid[y]?.[x] !== '.') {
        return;
      }
      const score = state.score + scoreChange;
      if (queue.has({ hash })) {
        const queuedItem = queue.get({ hash });
        if (score < queuedItem.score) {
          queuedItem.score = score;
          queue.reposition(queuedItem);
        } else if (score === queuedItem.score) {
          queuedItem.path = queuedItem.path.union(state.path);
        }
      } else {
        const path = new Set(state.path);
        path.add(`${x}-${y}`);
        queue.push({
          x, y, dir, score, hash, path,
        });
      }
    });
  }
  return bestState;
};

export const part1 = ([grid, start, end]) => findShortestPath(grid, start, end).score;

export const part2 = ([grid, start, end]) => findShortestPath(grid, start, end).path.size;
