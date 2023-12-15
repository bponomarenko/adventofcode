import { getAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.toGrid();

const countTreesAfterGenerations = async (grid, count) => {
  const memory = new Map();
  const limits = [[0, grid[0].length - 1], [0, grid.length - 1]];
  let jumped = false;
  while (count > 0) {
    grid = Array.from(grid, (row, y) => Array.from(row, (acre, x) => {
      const adjacent = getAdjacent(x, y, ...limits).map(([dx, dy]) => grid[dy][dx]);
      switch (acre) {
        case '.':
          return adjacent.filter(a => a === '|').length >= 3 ? '|' : acre;
        case '|':
          return adjacent.filter(a => a === '#').length >= 3 ? '#' : acre;
        default:
          return adjacent.includes('|') && adjacent.includes('#') ? acre : '.';
      }
    }));
    const hash = grid.map(row => row.join('')).join('\n');
    if (!jumped && memory.has(hash)) {
      count = (count % (memory.get(hash) - count)) - 1;
      jumped = true;
    } else {
      memory.set(hash, count);
      count -= 1;
    }
  }
  const countTrees = grid.flatMap(row => row.map(acre => +(acre === '|'))).sum();
  const countLumberyards = grid.flatMap(row => row.map(acre => +(acre === '#'))).sum();
  return countTrees * countLumberyards;
};

export const part1 = input => countTreesAfterGenerations(input, 10);

export const part2 = async input => countTreesAfterGenerations(input, 1000000000);
