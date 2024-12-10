import { getStraightAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.toGrid().map(row => row.map(Number));

const findHeads = (grid, start, visited, limits, num = 0) => {
  const heads = getStraightAdjacent(...start, ...limits).flatMap(([x, y]) => {
    if (grid[y][x] !== num + 1) {
      return null;
    }
    const hash = `${x}-${y}`;
    if (num === 8) {
      return hash;
    }
    return visited.has(hash) ? visited.get(hash) : findHeads(grid, [x, y], visited, limits, num + 1);
  });
  const unique = heads.filter(Boolean).unique();
  visited.set(start.join('-'), unique);
  return unique;
};

const findResult = (grid, fn) => {
  const visited = new Map();
  const limits = grid.gridLimits();
  return grid.sum((row, y) => row.sum((num, x) => (num === 0 ? fn(grid, [x, y], visited, limits) : 0)));
};

export const part1 = input => findResult(input, (...params) => findHeads(...params).length);

const getRating = (grid, start, visited, limits, num = 0) => {
  const rating = getStraightAdjacent(...start, ...limits).sum(([x, y]) => {
    if (grid[y][x] !== num + 1) {
      return 0;
    }
    if (num === 8) {
      return 1;
    }
    const hash = `${x}-${y}`;
    return visited.has(hash) ? visited.get(hash) : getRating(grid, [x, y], visited, limits, num + 1);
  });
  visited.set(start.join('-'), rating);
  return rating;
};

export const part2 = input => findResult(input, getRating);
