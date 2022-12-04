import WorkerPool from '../../utils/worker-pool.js';
import { fillGrid, getSquareSum } from './utils.js';

export const formatInput = input => +input;

export const part1 = input => {
  const grid = fillGrid(input);
  let coords = [-Infinity];

  for (let y = 0; y < 298; y += 1) {
    for (let x = 0; x < 298; x += 1) {
      const squareSum = getSquareSum(grid, x, y, 3);
      if (squareSum > coords[0]) {
        coords = [squareSum, x + 1, y + 1];
      }
    }
  }
  return coords.slice(1).join(',');
};

export const part2 = input => new Promise(resolve => {
  const grid = fillGrid(input);
  const pool = new WorkerPool({ workerPath: new URL('part2-worker.js', import.meta.url).pathname });
  let coords = [-Infinity];

  pool.on('done', () => {
    pool.close();
    resolve(coords.slice(1).join(','));
  });

  for (let size = 1; size <= 300; size += 1) {
    pool.runTask({ grid, size }, squareCoords => {
      if (squareCoords[0] > coords[0]) {
        coords = squareCoords;
      }
    });
  }
});
