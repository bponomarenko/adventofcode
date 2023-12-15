import { getStraightAdjacent, getRelativeCoord } from '../../utils/grid.js';

const oppositeDirs = { n: 's', s: 'n', e: 'w', w: 'e' };
const connections = {
  '|': ['n', 's'],
  '-': ['w', 'e'],
  L: ['n', 'e'],
  J: ['n', 'w'],
  7: ['s', 'w'],
  F: ['s', 'e'],
  '.': [],
};

export const formatInput = input => {
  const grid = input.toGrid();
  let start;

  // Find start position and replace it with the correct pipe
  grid.forEach((line, y) => {
    if (line.includes('S')) {
      const x = line.indexOf('S');
      start = [x, y];

      const adjacent = Object.fromEntries(Object.keys(oppositeDirs).map(dir => [dir, getRelativeCoord(x, y, dir)]));
      [grid[y][x]] = Object.entries(connections).find(([, steps]) => steps.every(step => {
        const [ax, ay] = adjacent[step];
        return connections[grid[ay][ax]].includes(oppositeDirs[step]);
      }));
    }
  });
  return { grid, start };
};

export const part1 = ({ grid, start }) => {
  const queue = [[start, start.join(',')]];
  const visited = new Set();
  while (queue.length > 0) {
    const [[x, y], hash] = queue.pop();
    visited.add(hash);

    connections[grid[y][x]].forEach(dir => {
      const next = getRelativeCoord(x, y, dir);
      const nextHash = next.join(',');
      if (!visited.has(nextHash)) {
        queue.push([next, nextHash]);
      }
    });
  }
  return visited.size / 2;
};

export const part2 = ({ grid, start }) => {
  // Expand grid, so we can reach to any enclosed outer points
  const expandedWidth = grid[0].length * 2 + 1;
  const expandedHeigth = grid.length * 2 + 1;
  const expandedGrid = Array.from(
    new Array(expandedHeigth),
    (_, y) => Array.from(
      new Array(expandedWidth),
      (__, x) => (x % 2 === 0 || y % 2 === 0 ? '.' : grid[(y - 1) / 2][(x - 1) / 2]),
    ),
  );

  // Complete pipes loop by filling missing pipes after the expansion
  const expandedStart = [start[0] * 2 + 1, start[1] * 2 + 1];
  let queue = [[expandedStart, expandedStart.join(',')]];
  const visited = new Set();

  while (queue.length > 0) {
    const [[x, y], hash] = queue.pop();
    visited.add(hash);

    connections[expandedGrid[y][x]].forEach(dir => {
      let next = getRelativeCoord(x, y, dir);
      let nextHash = next.join(',');
      if (!visited.has(nextHash)) {
        visited.add(nextHash);
        const [nx, ny] = next;
        expandedGrid[ny][nx] = dir === 's' || dir === 'n' ? '|' : '-';
        next = getRelativeCoord(nx, ny, dir);
        queue.push([next, next.join(',')]);
      }
    });
  }

  // Find all outer tiles
  queue = [[[0, 0], '0,0']];
  const outer = new Set(visited); // outer tiles would also include the pipe itself
  const limits = [[0, expandedWidth - 1], [0, expandedHeigth - 1]];

  while (queue.length > 0) {
    const [[x, y], hash] = queue.pop();
    outer.add(hash);

    getStraightAdjacent(x, y, ...limits).forEach(adjacent => {
      const aHash = adjacent.join(',');
      if (!outer.has(aHash)) {
        queue.push([adjacent, aHash]);
      }
    });
  }

  // Go through the original grid and check for every point if it is inner or outer based on the expanded grid data
  return grid.sum((line, y) => line.sum((_, x) => {
    const hash = `${x * 2 + 1},${y * 2 + 1}`;
    return (outer.has(hash) ? 0 : 1);
  }));
};
