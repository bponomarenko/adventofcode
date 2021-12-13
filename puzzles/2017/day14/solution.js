import { getKnotHash } from '../day10/solution.js';
import { getStraightAdjacent } from '../../utils/grid.js';

export const formatInput = input => input;

const defragment = input => {
  const hashes = [];
  for (let i = 0; i < 128; i += 1) {
    hashes.push(getKnotHash(`${input}-${i}`).split('').map(char => parseInt(char, 16)));
  }
  return hashes;
};

export const part1 = input => defragment(input)
  .reduce((acc, hash) => acc + hash.reduce((sum, num) => {
    for (let j = 0; j < 4; j += 1) {
      if ((num >> j) & 1) {
        sum += 1;
      }
    }
    return sum;
  }, 0), 0);

export const part2 = input => {
  const grid = defragment(input).map(hash => hash.map(num => num.toString(2).padStart(4, '0')).join(''));
  const visited = new Set();

  const isNotEdge = ([x, y]) => !visited.has(`${x}-${y}`) && grid[x][y] !== '0';

  const markRegion = ([x, y]) => {
    // Mark as "visited"
    visited.add(`${x}-${y}`);
    // Mark adjacent
    getStraightAdjacent(grid, x, y).filter(isNotEdge).forEach(point => markRegion(point));
  };

  let count = 0;

  for (let i = 0; i < 128; i += 1) {
    for (let j = 0; j < 128; j += 1) {
      if (isNotEdge([i, j])) {
        markRegion([i, j]);
        count += 1;
      }
    }
  }
  return count;
};
