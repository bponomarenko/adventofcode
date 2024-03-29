import { getStraightAdjacent } from '../../utils/grid.js';

export const formatInput = input => {
  const [map, steps] = input.split('\n\n');
  const grid = map.split('\n');
  let start;
  grid.forEach((row, y) => {
    if (row.includes('S')) {
      start = [row.indexOf('S'), y];
      grid[y] = row.replace('S', '.');
    }
  });
  return { grid, start, steps: steps ? +steps : null };
};

const countPlots = (grid, start, steps) => {
  const width = grid[0].length;
  const height = grid.length;
  const plots = new Set();
  const snapshots = [];
  let stepSet = new Map([[start.join(','), start]]);
  let loop = 0;
  let increase = 0;
  let prevSize = 0;

  while (steps >= 0) {
    const even = steps % 2 === 0;
    const queue = Array.from(stepSet.values());
    stepSet = new Map();

    queue.forEach(([dx, dy]) => {
      if (even) {
        plots.add(`${dx},${dy}`);
      }
      if ((dx % width) === 0 && (dy % height) === 0 && dx === dy && dx > width) {
        if (snapshots.length < 3 && snapshots.every(([, , value]) => value !== dx)) {
          snapshots.push([steps, plots.size, dx]);

          if (snapshots.length === 2) {
            loop = snapshots[0][0] - snapshots[1][0];
          } else if (snapshots.length === 3) {
            increase = snapshots[2][1] - 2 * snapshots[1][1] + snapshots[0][1];
          }
        }
      }

      getStraightAdjacent(dx, dy).forEach(([x, y]) => {
        const ay = y >= 0 ? y % height : height + ((y + 1) % height) - 1;
        const ax = x >= 0 ? x % width : width + ((x + 1) % width) - 1;
        if (grid[ay][ax] === '#') {
          return;
        }
        const hash = `${x},${y}`;
        if (plots.has(hash) || stepSet.has(hash)) {
          return;
        }
        stepSet.set(hash, [x, y]);
      });
    });

    if (loop && steps % loop === 0) {
      if (prevSize) {
        const n = steps / loop;
        return plots.size + (increase * n * (n + 1)) / 2 + (plots.size - prevSize) * n;
      }
      prevSize = plots.size;
    }
    steps -= 1;
  }
  return plots.size;
};

export const part1 = ({ grid, start, steps }) => countPlots(grid, start, steps || 64);

export const part2 = ({ grid, start, steps }) => countPlots(grid, start, steps || 26501365);
