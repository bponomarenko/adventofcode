import { getRelativeCoord } from '../../utils/grid.js';
import BinaryHeap from '../../utils/binary-heap.js';

export const formatInput = input => input.split('\n');

const directions = ['n', 'w', 'e', 's'];

const findShortestPath = (grid, minDirLength, maxDirLength) => {
  const lastX = grid[0].length - 1;
  const lastY = grid.length - 1;
  const visited = new Set();
  const queue = new BinaryHeap(state => state.heatLoss, state => state.hash);
  queue.push({ x: 0, y: 0, heatLoss: 0, hash: '0,0', dirCount: minDirLength });

  while (queue.size) {
    // 1. Get next state
    const state = queue.pop();

    // 2. Check if we got to the exit
    if (state.x === lastX && state.y === lastY) {
      if (state.dirCount >= minDirLength) {
        return state.heatLoss;
      }
      continue;
    }

    // 3. Mark it as visited
    visited.add(state.hash);

    // 3. Find next states
    directions.forEach(dir => {
      if (state.dir === dir ? state.dirCount >= maxDirLength : state.dirCount < minDirLength) {
        return;
      }

      const [x, y] = getRelativeCoord(state.x, state.y, dir);
      if (x < 0 || x > lastX || y < 0 || y > lastY || state.prev === `${x},${y}`) {
        return;
      }

      const dirCount = state.dir === dir ? state.dirCount + 1 : 1;
      const hash = `${x},${y},${dir},${dirCount}`;
      if (visited.has(hash)) {
        return;
      }

      if (!queue.has({ hash })) {
        queue.push({
          x,
          y,
          hash,
          dir,
          dirCount,
          heatLoss: state.heatLoss + +grid[y][x],
          prev: `${state.x},${state.y}`,
        });
      }
    });
  }
  return null;
};

export const part1 = input => findShortestPath(input, 0, 3);

export const part2 = input => findShortestPath(input, 4, 10);
