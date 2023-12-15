import { createHash } from 'crypto';
import { getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => input;

const gridSize = 3;
const openRe = /[^0-9a]/;

const getMoves = (pos, hash) => ['U', 'D', 'L', 'R']
  .filter((move, i) => (i % 2 === 0 ? pos[i > 1 ? 1 : 0] > 0 : pos[i > 1 ? 1 : 0] < gridSize) && openRe.test(hash[i]));

export const part1 = input => {
  const queue = [{ path: '', pos: [0, 0] }];
  let shortestPath;

  while (queue.length) {
    const { path, pos } = queue.shift();
    if (pos[0] === gridSize && pos[1] === gridSize) {
      // Path to the vault found!c
      if (!shortestPath || path.length < shortestPath.length) {
        shortestPath = path;
      }

      continue;
    }

    if (path.length >= shortestPath?.length) {
      // No need to continue as the path would't be the shortest anymore

      continue;
    }

    const hash = createHash('md5').update(`${input}${path}`).digest('hex').slice(0, 4);
    getMoves(pos, hash).forEach(move => {
      queue.push({ path: `${path}${move}`, pos: getRelativeCoord(...pos.toReversed(), move).toReversed() });
    });
  }
  return shortestPath;
};

export const part2 = input => {
  const queue = [{ path: '', pos: [0, 0] }];
  let longestPathLength = 0;

  while (queue.length) {
    const { path, pos } = queue.shift();
    if (pos[0] === gridSize && pos[1] === gridSize) {
      // Path to the vault found!
      if (path.length > longestPathLength) {
        longestPathLength = path.length;
      }

      continue;
    }

    const hash = createHash('md5').update(`${input}${path}`).digest('hex').slice(0, 4);
    getMoves(pos, hash).forEach(move => {
      queue.push({ path: `${path}${move}`, pos: getRelativeCoord(...pos.toReversed(), move).toReversed() });
    });
  }
  return longestPathLength;
};
