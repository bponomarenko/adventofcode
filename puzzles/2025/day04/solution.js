import { getAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(line => line.split(''));

const getAdjacentRolls = (grid, limits) => grid.flatMap((row, y) => row.map((cell, x) => {
  if (cell === '@') {
    const adjacentRolls = getAdjacent(x, y, ...limits).filter(([ax, ay]) => grid[ay][ax] === '@').length;
    if (adjacentRolls < 4) {
      return [x, y];
    }
  }
  return null;
})).filter(Boolean);

export const part1 = input => getAdjacentRolls(input, input.gridLimits()).length;

export const part2 = input => {
  const limits = input.gridLimits();
  let counter = 0;
  let toRemove;
  do {
    toRemove = getAdjacentRolls(input, limits);
    counter += toRemove.length;
    toRemove.forEach(([x, y]) => {
      input[y][x] = '.';
    });
  } while (toRemove.length > 0);
  return counter;
};
