import { getStraightAdjacent, getRelativeCoord, changeDirection } from '../../utils/grid.js';

export const formatInput = input => input.toGrid();

const getAreaAndPerimeter = (grid, limits, start, visited) => {
  const area = { area: 0 };
  const char = grid[start[1]][start[0]];
  const queue = [start];
  let perimeter = 0;

  while (queue.length) {
    const [x, y] = queue.shift();
    const hash = `${x}-${y}`;
    if (visited.has(hash)) {
      continue;
    }
    visited.set(hash, area);
    area.area += 1;

    const sadj = getStraightAdjacent(x, y, ...limits);
    let adj = sadj.filter(([nx, ny]) => grid[ny][nx] === char);
    perimeter += 4 - adj.length;
    queue.push(...adj);
  }
  return [area.area, perimeter];
};

const getTotalPrice = (grid, cb) => {
  const visited = new Map();
  const limits = grid.gridLimits();
  return grid.sum((row, y) => row.sum((char, x) => {
    if (visited.has(`${x}-${y}`)) {
      return 0;
    }
    return cb(x, y, char, limits, visited);
  }));
};

export const part1 = input => getTotalPrice(input, (x, y, _, limits, visited) => {
  const [area, perimeter] = getAreaAndPerimeter(input, limits, [x, y], visited);
  return area * perimeter;
});

const getLeftChar = (grid, dir, x, y) => {
  const [lx, ly] = getRelativeCoord(x, y, changeDirection(dir, -90));
  return grid[ly]?.[lx];
};

const getSides = (grid, start, char, limits) => {
  const startDir = ['e', 's'].find(d => {
    const [x, y] = getRelativeCoord(...start, d);
    return grid[y]?.[x] === char && getLeftChar(grid, d, ...start) !== char;
  });
  if (!startDir) {
    const adj = getStraightAdjacent(...start, ...limits);
    return [4, adj.length === 4 && adj.unique(([x, y]) => grid[y][x]).length === 1];
  }
  const eChar = getLeftChar(grid, startDir, ...start);
  let dir = startDir;
  let sides = 0;
  let pos = start;
  let enclave = !!eChar;

  do {
    const [x, y] = getRelativeCoord(...pos, dir);
    if (grid[y]?.[x] === char) {
      pos = [x, y];

      const lChar = getLeftChar(grid, dir, x, y);
      if (lChar === char) {
        dir = changeDirection(dir, -90);
        sides += 1;
      } else {
        enclave = enclave && lChar === eChar;
      }
      continue;
    }

    sides += 1;
    dir = changeDirection(dir, 90);
    enclave = enclave && getLeftChar(grid, dir, x, y) === eChar;
  } while (pos[0] !== start[0] || pos[1] !== start[1] || dir !== startDir);
  console.log(start, char, sides, enclave, eChar);
  return [sides, enclave];
};

export const part2 = input => getTotalPrice(input, (x, y, char, limits, visited) => {
  const [area] = getAreaAndPerimeter(input, limits, [x, y], visited);
  const [sides, enclave] = getSides(input, [x, y], char, limits);
  const outerArea = enclave ? visited.get(getRelativeCoord(x, y, 'n').join('-'))?.area ?? 0 : 0;
  return (area + outerArea) * sides;
});
