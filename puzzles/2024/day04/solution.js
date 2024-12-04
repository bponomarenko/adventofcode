import { getRelativeCoord, directions } from '../../utils/grid.js';

export const formatInput = input => input.toGrid();

const xmas = 'XMAS';

const findXmas = (grid, x, y, dir, index) => {
  if (grid[y]?.[x] !== xmas[index]) {
    return false;
  }
  if (index === 3) {
    return true;
  }
  const [nx, ny] = getRelativeCoord(x, y, dir);
  return findXmas(grid, nx, ny, dir, index + 1);
};

export const part1 = grid => grid.flatMap((row, y) => row.flatMap((_, x) => directions.map(dir => findXmas(grid, x, y, dir, 0)))).sum();

const findXMas = (grid, x, y) => {
  if (grid[y + 1][x + 1] !== 'A') {
    return false;
  }
  return (
    (grid[y][x] === 'M' && grid[y + 2][x + 2] === 'S')
    || (grid[y][x] === 'S' && grid[y + 2][x + 2] === 'M')
  )
    && (
      (grid[y][x + 2] === 'M' && grid[y + 2][x] === 'S')
      || (grid[y][x + 2] === 'S' && grid[y + 2][x] === 'M')
    );
};

export const part2 = grid => grid.slice(0, -2).flatMap((row, y) => row.slice(0, -2).map((_, x) => findXMas(grid, x, y))).sum();
