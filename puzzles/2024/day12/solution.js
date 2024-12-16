import { getStraightAdjacent, getRelativeCoord, changeDirection } from '../../utils/grid.js';

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

    const sadj = getStraightAdjacent(x, y, ...limits);
    const adj = sadj.filter(([nx, ny]) => grid[ny][nx] === char);
    perimeter += 4 - adj.length;
    queue.push(...adj);
    if (adj.length !== 4) {
      edges.push([
        hash,
        [x, y],
        ['n', 's', 'e', 'w'].filter(dir => {
          const [cx, cy] = getRelativeCoord(x, y, dir);
          return grid[cy]?.[cx] !== char;
        }),
      ]);
    }
  }
  return [area.area, perimeter, edges];
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

const getSides = (grid, start, char, edges) => {
  const startDir = ['e', 's'].find(d => {
    const [x, y] = getRelativeCoord(...start, d);
    return grid[y]?.[x] === char && getLeftChar(grid, d, ...start) !== char;
  });
  if (!startDir) {
    const index = edges.findIndex(([hash]) => hash === start.join('-'));
    if (index !== -1) {
      edges.splice(index, 1);
    }
    return 4;
  }
  let dir = startDir;
  let count = 0;
  let pos = start;

  do {
    const index = edges.findIndex(([hash]) => hash === pos.join('-'));
    if (index >= 0) {
      const [,, points] = edges[index];
      const pIndex = points.indexOf(changeDirection(dir, -90));
      if (pIndex !== -1) {
        points.splice(pIndex, 1);
        if (points.length === 0) {
          edges.splice(index, 1);
        }
      }
    }
    const [x, y] = getRelativeCoord(...pos, dir);
    if (grid[y]?.[x] === char) {
      pos = [x, y];
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
  return count;
};

export const part2 = input => getTotalPrice(input, (x, y, char, limits, visited) => {
  let [area, , edges] = getAreaAndPerimeter(input, limits, [x, y], visited);
  let totalSides = 0;
  while (edges.length) {
    const [, pos] = edges.find(([,, points]) => points.includes('n') || points.includes('e'));
    totalSides += getSides(input, pos, char, edges);
  }
  return area * totalSides;
});
