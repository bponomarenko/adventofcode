import { getStraightAdjacent } from '../../utils/grid.js';

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

function cheats(grid, limits, pos, path, indexDelta, cheatCount) {
  const delta = indexDelta - cheatCount;
  const adj = getStraightAdjacent(...pos, ...limits);
  let sum = 0;
  for (let i = 0; i < adj.length; i += 1) {
    const [x, y] = adj[i];
    if (grid[y][x] === '#') {
      if (cheatCount > 0) {
        sum += cheats(grid, limits, [x, y], path, indexDelta, cheatCount - 1);
      }
    } else {
      const saved = path.indexOf(`${x}-${y}`) - delta;
      if (saved >= 100) {
        sum += 1;
      }
    }
  }
  return sum;
}

const countCheats = (grid, start, finish, cheatSize) => {
  const limits = grid.gridLimits();
  const path = getPath(grid, limits, start, finish);
  return path.sum((pos, i) => cheats(grid, limits, pos.split('-').map(Number), path, i + cheatSize, cheatSize - 1));
};

export const part1 = input => countCheats(...input, 2);

export const part2 = input => countCheats(...input, 20);
