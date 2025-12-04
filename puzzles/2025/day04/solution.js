import { getAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(line => line.split(''));

export const part1 = input => {
  const limits = input.gridLimits();
  return input.map((row, y) => row.map((cell, x) => {
    if (cell === '@') {
      const adjacentRolls = getAdjacent(x, y, ...limits).filter(([ax, ay]) => input[ay][ax] === '@').length;
      if (adjacentRolls < 4) {
        return 1;
      }
    }
    return 0;
  }).sum()).sum();
};

export const part2 = input => {
  const limits = input.gridLimits();
  let counter = 0;
  let toRemove;
  do {
    toRemove = input.flatMap((row, y) => row.map((cell, x) => {
      if (cell === '@') {
        const adjacentRolls = getAdjacent(x, y, ...limits).filter(([ax, ay]) => input[ay][ax] === '@').length;
        if (adjacentRolls < 4) {
          return [x, y];
        }
      }
      return null;
    })).filter(Boolean);

    counter += toRemove.length;
    toRemove.forEach(([x, y]) => {
      input[y][x] = '.';
    });
  } while (toRemove.length > 0);
  return counter;
};
