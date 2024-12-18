import BinaryHeap from '../../utils/binary-heap.js';
import { getStraightAdjacent } from '../../utils/grid.js';

export const formatInput = input => {
  const bytes = input.split('\n').map(row => row.split(',').map(Number));
  const size = Math.max(...bytes.map(([x]) => x)) + 1;
  return [bytes, Array.from(new Array(size), () => new Array(size).fill('.'))];
};

const findShortestPath = (grid, [sx, sy], [ex, ey]) => {
  const limits = grid.gridLimits();
  const visited = new Set();
  const queue = new BinaryHeap(state => state.length, state => state.hash);
  queue.push({ x: sx, y: sy, hash: `${sx},${sy}`, path: [`${sx},${sy}`] });

  while (queue.size) {
    // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the exit
    if (state.x === ex && state.y === ey) {
      return state.path;
    }

    // 3. Mark it as visited
    visited.add(state.hash);

    // 3. Find next states
    getStraightAdjacent(state.x, state.y, ...limits).forEach(([x, y]) => {
      const hash = `${x},${y}`;
      if (visited.has(hash) || grid[y][x] === '#') {
        return;
      }
      const path = [...state.path, hash];
      if (queue.has({ hash })) {
        const queuedItem = queue.get({ hash });
        if (path.length < queuedItem.path.length) {
          queuedItem.path = path;
          queue.reposition(queuedItem);
        }
      } else {
        queue.push({ x, y, path, hash });
      }
    });
  }
  return null;
};

export const part1 = ([bytes, grid], isTest) => {
  bytes.slice(0, isTest ? 12 : 1024).forEach(([x, y]) => {
    grid[y][x] = '#';
  });
  const max = grid.length - 1;
  return findShortestPath(grid, [0, 0], [max, max]).size - 1;
};

export const part2 = ([bytes, grid]) => {
  const max = grid.length - 1;
  const params = [[0, 0], [max, max]];
  let path;
  while (bytes.length) {
    const [x, y] = bytes.shift();
    grid[y][x] = '#';
    const hash = `${x},${y}`;
    if (path) {
      if (path.includes(hash)) {
        const index = path.indexOf(hash) - 1;
        const subPath = findShortestPath(grid, path[index].split(',').map(Number), params[1]);
        path = subPath ? path.slice(0, index).concat(...subPath) : null;
      }
    } else {
      path = findShortestPath(grid, ...params);
    }
    if (!path) {
      return hash;
    }
  }
  return null;
};
