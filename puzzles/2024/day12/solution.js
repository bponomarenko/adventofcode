import { getStraightAdjacent, getAdjacent, getRelativeCoord, changeDirection } from '../../utils/grid.js';

export const formatInput = input => input.toGrid();

const getAreaAndPerimeter = (grid, limits, start, visited) => {
  const area = { area: 0 };
  const char = grid[start[1]][start[0]];
  const queue = [start];
  const edges = [];
  let perimeter = 0;

  while (queue.length) {
    const [x, y] = queue.shift();
    const hash = `${x}-${y}`;
    if (visited.has(hash)) {
      continue;
    }
    visited.set(hash, area);
    area.area += 1;

    const adj = getStraightAdjacent(x, y, ...limits).filter(([nx, ny]) => grid[ny][nx] === char);
    perimeter += 4 - adj.length;
    queue.push(...adj);
    if (adj.length !== 4) {
      edges.push(hash);
    }
  }
  return [area.area, perimeter, edges];
};

const getTotalPrice = (grid, cb) => {
  console.log(grid.toGridString());
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

const getSides = (grid, start, char) => {
  const startDir = ['e', 's'].find(d => {
    const [x, y] = getRelativeCoord(...start, d);
    return grid[y]?.[x] === char && getLeftChar(grid, d, ...start) !== char;
  });
  const sides = new Set([start.join('-')]);
  if (!startDir) {
    return [4, sides];
  }
  let dir = startDir;
  let count = 0;
  let pos = start;

  do {
    const [x, y] = getRelativeCoord(...pos, dir);
    if (grid[y]?.[x] === char) {
      pos = [x, y];
      sides.add(`${x}-${y}`);

      const lChar = getLeftChar(grid, dir, x, y);
      if (lChar === char) {
        dir = changeDirection(dir, -90);
        count += 1;
      }
      continue;
    }

    count += 1;
    dir = changeDirection(dir, 90);
  } while (pos[0] !== start[0] || pos[1] !== start[1] || dir !== startDir);
  return [count, sides];
};

export const part2 = input => getTotalPrice(input, (x, y, char, limits, visited) => {
  let [area, , edges] = getAreaAndPerimeter(input, limits, [x, y], visited);
  let [count, sides] = getSides(input, edges[0].split('-').map(Number), char);
  edges = edges.filter(edge => !sides.has(edge));
  console.log(edges);
  let totalSides = count;
  while (edges.length) {
    [count, sides] = getSides(input, edges.shift().split('-').map(Number), char);
    totalSides += count;
  }
  return area * totalSides;
});
