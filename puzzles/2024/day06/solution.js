import { getRelativeCoord, changeDirection } from '../../utils/grid.js';

export const formatInput = input => {
  const grid = input.toGrid();
  const y = grid.findIndex(row => row.includes('^'));
  const x = grid[y].findIndex(char => char === '^');
  return [grid, [x, y]];
};

const simulatePath = (grid, start, cb, dir = 'n', visited = new Map()) => {
  let [x, y] = start;
  let loop = 0;
  do {
    const hash = `${x}-${y}`;
    const prevDir = dir;
    let visitedDir = visited.get(hash);
    if (prevDir === visitedDir) {
      loop = 1;
      break;
    }

    let obstructed = false;
    let nx;
    let ny;
    do {
      [nx, ny] = getRelativeCoord(x, y, dir);
      obstructed = grid[ny]?.[nx] === '#';
      if (obstructed) {
        dir = changeDirection(dir, 90);
      }
    } while (obstructed);

    if (cb && grid[ny]?.[nx] && !visited.has(`${nx}-${ny}`)) {
      cb([x, y], nx, ny, dir, visited);
    }

    if (!visitedDir) {
      visited.set(hash, prevDir);
    }

    [x, y] = [nx, ny];
  } while (grid[y]?.[x]);
  return [visited.size, loop];
};

export const part1 = ([grid, start]) => simulatePath(grid, start)[0];

export const part2 = ([grid, start]) => {
  let loops = 0;
  simulatePath(grid, start, (pos, nx, ny, dir, visited) => {
    grid[ny][nx] = '#';
    loops += simulatePath(grid, pos, null, dir, new Map(visited))[1];
    grid[ny][nx] = '.';
  });
  return loops;
};
