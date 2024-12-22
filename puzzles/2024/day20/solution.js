import { join } from 'node:path';
import { getStraightAdjacent } from '../../utils/grid.js';
import WorkerPool from '../../utils/worker-pool.js';
import runWorker from './cheats-worker.js';

export const formatInput = input => {
  const grid = input.toGrid();
  let start;
  let finish;
  grid.forEach((row, y) => row.forEach((char, x) => {
    if (char === 'S') {
      grid[y][x] = '.';
      start = [x, y];
    }
    if (char === 'E') {
      grid[y][x] = '.';
      finish = [x, y];
    }
  }));
  return [grid, start, finish];
};

const getPath = (grid, limits, start, finish) => {
  const path = [];
  let pos = start;
  let hash = pos.join('-');
  while (hash !== finish.join('-')) {
    path.push(hash);
    pos = getStraightAdjacent(...pos, ...limits).find(([x, y]) => grid[y][x] === '.' && !path.includes(`${x}-${y}`));
    hash = pos.join('-');
  }
  return path.concat(finish.join('-'));
};

export const part1 = ([grid, start, finish]) => {
  const limits = grid.gridLimits();
  const path = getPath(grid, limits, start, finish);
  let sum = 0;
  const collect = res => {
    sum += res;
  };
  // Use worker function directy, since on part1 it is faster than multi-thread approach
  path.forEach((_, startIndex) => runWorker(collect, { path, startIndex, cheatSize: 2, limits }));
  return sum;
};

export const part2 = ([grid, start, finish]) => new Promise(resolve => {
  const pool = new WorkerPool({ workerPath: join(import.meta.dirname, 'cheats-worker.js') });
  const limits = grid.gridLimits();
  const path = getPath(grid, limits, start, finish);
  let sum = 0;

  pool.on('done', () => {
    resolve(sum);
  });

  path.slice(0, -100).forEach((_, startIndex) => {
    pool.runTask({ path, startIndex, cheatSize: 20, limits }, res => {
      sum += res;
    });
  });
});
