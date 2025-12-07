import { getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => {
  const grid = input.toGrid();
  return [grid, [grid[0].indexOf('S'), 0]];
};

export const part1 = ([grid, start]) => {
  const visited = new Set();
  const queue = [start];
  let splits = 0;

  while (queue.length) {
    const [x, y] = queue.shift();
    const hash = `${x}-${y}`;
    if (visited.has(hash)) {
      continue;
    }
    visited.add(hash);

    const [nx, ny] = getRelativeCoord(x, y, 's');
    const next = grid[ny]?.[nx];
    if (next === '.') {
      queue.push([nx, ny]);
    } else if (next === '^') {
      splits += 1;
      queue.push(getRelativeCoord(nx, ny, 'e'), getRelativeCoord(nx, ny, 'w'));
    }
  }
  return splits;
};

const countTimelines = (grid, visited, x, y) => {
  const hash = `${x}-${y}`;
  if (visited.has(hash)) {
    return visited.get(hash);
  }
  const [nx, ny] = getRelativeCoord(x, y, 's');
  let count;
  switch (grid[ny]?.[nx]) {
    case '.':
      count = countTimelines(grid, visited, nx, ny);
      break;
    case '^':
      count = countTimelines(grid, visited, ...getRelativeCoord(nx, ny, 'e')) + countTimelines(grid, visited, ...getRelativeCoord(nx, ny, 'w'));
      break;
    default:
      count = 1;
      break;
  }
  visited.set(hash, count);
  return count;
};

export const part2 = ([grid, start]) => countTimelines(grid, new Map(), ...start);
