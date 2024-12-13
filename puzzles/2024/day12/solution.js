import { getStraightAdjacent, getAdjacent, getRelativeCoord, changeDirection } from '../../utils/grid.js';

export const formatInput = input => input.toGrid();

const getRegionPrice = (grid, limits, start, visited) => {
  const char = grid[start[1]][start[0]];
  const queue = [start];
  let perimetr = 0;
  let area = 0;

  while (queue.length) {
    const [x, y] = queue.shift();
    const hash = `${x}-${y}`;
    if (visited.has(hash)) {
      continue;
    }
    visited.add(hash);
    area += 1;

    const adjacent = getStraightAdjacent(x, y, ...limits).filter(([nx, ny]) => grid[ny][nx] === char);
    perimetr += 4 - adjacent.length;
    queue.push(...adjacent);
  }
  return area * perimetr;
};

export const part1 = input => {
  const visited = new Set();
  const limits = input.gridLimits();
  return input.sum((row, y) => row.sum((_, x) => (visited.has(`${x}-${y}`) ? 0 : getRegionPrice(input, limits, [x, y], visited))));
};

const getArea = (grid, limits, start, visited) => {
  const areaObj = { area: 0 };
  const char = grid[start[1]][start[0]];
  const queue = [start];
  let area = 0;
  let inside = true;

  while (queue.length) {
    const [x, y] = queue.shift();
    const hash = `${x}-${y}`;
    if (visited.has(hash)) {
      continue;
    }
    visited.set(hash, areaObj);
    area += 1;

    const adjacent = getStraightAdjacent(x, y, ...limits).filter(([nx, ny]) => grid[ny][nx] === char);
    queue.push(...adjacent);

    if (inside) {
      const adj = getAdjacent(x, y, ...limits);
      inside = adj.length === 8 && adj.map(([ax, ay]) => grid[ay][ax]).unique().length <= 2;
    }
  }
  areaObj.area = area;
  return [area, inside];
};

const getSides = (grid, start) => {
  const char = grid[start[1]][start[0]];
  const sideDir = ['n', 'e', 's', 'w'].find(d => {
    const [x, y] = getRelativeCoord(...start, d);
    const [lx, ly] = getRelativeCoord(...start, changeDirection(d, -90));
    return grid[y]?.[x] === char && grid[ly]?.[lx] !== char;
  });
  if (!sideDir) {
    return 4;
  }
  let dir = sideDir;
  let sides = 0;
  let pos = start;

  do {
    let [x, y] = getRelativeCoord(...pos, dir);
    if (grid[y]?.[x] === char) {
      pos = [x, y];

      const ldir = changeDirection(dir, -90);
      [x, y] = getRelativeCoord(...pos, ldir);
      if (grid[y]?.[x] === char) {
        dir = ldir;
        sides += 1;
      }
      continue;
    }

    sides += 1;
    dir = changeDirection(dir, 90);
  } while (pos[0] !== start[0] || pos[1] !== start[1] || dir !== sideDir);
  return sides;
};

export const part2 = input => {
  const visited = new Map();
  const limits = input.gridLimits();
  return input.sum((row, y) => row.sum((char, x) => {
    if (visited.has(`${x}-${y}`)) {
      return 0;
    }
    const [area, inside] = getArea(input, limits, [x, y], visited);
    const outerArea = inside ? visited.get(getRelativeCoord(x, y, 'n').join('-')).area : 0;
    return (area + outerArea) * getSides(input, [x, y]);
  }));
};
