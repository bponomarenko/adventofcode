import { sum, combinations } from '../../utils/collections.js';
import { getDistance, rotate } from '../../utils/grid.js';

export const formatInput = input => {
  const [grid, num] = input.split('\n\n');
  return [
    grid.split('\n').map(line => line.split('')),
    num ? +num : null,
  ];
};

const getSum = (grid, expansionSize) => {
  const emptyRows = grid.map((row, y) => (row.includes('#') ? -1 : y)).filter(num => num !== -1);
  const emptyColumns = rotate(grid, false).map((row, y) => (row.includes('#') ? -1 : y)).filter(num => num !== -1);

  // find galaxies
  const galaxies = grid.flatMap((row, y) => row.map((point, x) => (point === '#' ? [x, y] : null)).filter(Boolean));

  const distances = Array.from(combinations(galaxies, 2)).map(([g1, g2]) => {
    let distance = getDistance(g1, g2);

    emptyRows.forEach(row => {
      if ((g1[1] < row && g2[1] > row) || (g2[1] < row && g1[1] > row)) {
        distance += expansionSize - 1;
      }
    });

    emptyColumns.forEach(row => {
      if ((g1[0] < row && g2[0] > row) || (g2[0] < row && g1[0] > row)) {
        distance += expansionSize - 1;
      }
    });
    return distance;
  });
  return sum(distances);
};

export const part1 = ([grid]) => getSum(grid, 2);

export const part2 = ([grid, size]) => getSum(grid, size || 1000000);
