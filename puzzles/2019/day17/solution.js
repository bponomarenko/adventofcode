import { getStraightAdjacent, getRelativeCoord, changeDirection } from '../../utils/grid.js';
import Intcode from '../intcode.js';

export const formatInput = input => input;

const getScaffolding = program => new Intcode(program)
  .output
  .join(',')
  .split(/,?10,?/)
  .map(row => (row.length > 0 ? row.split(',').map(Number) : null))
  .filter(Boolean);

export const part1 = input => {
  const grid = getScaffolding(input);
  let alignmentParams = 0;
  for (let y = 0; y < grid.length; y += 1) {
    const row = grid[y];
    for (let x = 0; x < row.length; x += 1) {
      const adjacent = getStraightAdjacent(x, y, [0, row.length - 1], [0, grid.length - 1]);
      if (adjacent.length >= 3 && grid[y][x] !== 46 && adjacent.every(([ax, ay]) => grid[ay][ax] !== 46)) {
        alignmentParams += x * y;
      }
    }
  }
  return alignmentParams;
};

const isScaffold = (grid, [x, y]) => grid[y]?.[x] === 35;

const findRobot = grid => {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (!isScaffold(grid, [x, y]) && grid[y][x] !== 46) {
        return [x, y];
      }
    }
  }
  return null;
};

const directionsMap = { 94: 'n', 62: 'e', 118: 's', 60: 'w' };

const findPath = (grid, x, y) => {
  const path = [];
  let dir = directionsMap[grid[y][x]];

  for (; ;) {
    // Find next direction
    let nextDir = changeDirection(dir, -90);
    if (isScaffold(grid, getRelativeCoord(x, y, nextDir))) {
      dir = nextDir;
      path.push('L');
    } else {
      nextDir = changeDirection(dir, 90);
      if (isScaffold(grid, getRelativeCoord(x, y, nextDir))) {
        dir = nextDir;
        path.push('R');
      } else {
        // Found the finish
        break;
      }
    }

    // Follow the path
    let count = 0;
    while (isScaffold(grid, getRelativeCoord(x, y, dir))) {
      [x, y] = getRelativeCoord(x, y, dir);
      count += 1;
    }
    path.push(count);
  }

  return path;
};

const notPattern = item => item !== 'A' && item !== 'B' && item !== 'C';

function* pattern(path) {
  const start = path.findIndex(notPattern);
  if (start === -1) {
    return;
  }

  for (let i = start; i < path.length; i += 2) {
    if (!notPattern(i) || !notPattern(i + 1)) {
      break;
    }
    const str = path.slice(start, i + 2).join(',');
    if (str.length > 20) {
      break;
    }
    yield str;
  }
}

const findCommands = path => {
  for (let a of pattern(path)) {
    const aPath = path.join(',').replaceAll(a, 'A').split(',');
    for (let b of pattern(aPath)) {
      const bPath = aPath.join(',').replaceAll(b, 'B').split(',');
      for (let c of pattern(bPath)) {
        const main = bPath.join(',').replaceAll(c, 'C');
        if (main.length <= 20) {
          return { main, a, b, c };
        }
      }
    }
  }
  return null;
};

export const part2 = input => {
  const grid = getScaffolding(input);
  const [x, y] = findRobot(grid);
  const path = findPath(grid, x, y);
  const { main, a, b, c } = findCommands(path);
  const commands = `${main}\n${a}\n${b}\n${c}\nn\n`.split('').map(char => char.charCodeAt(0));
  return new Intcode(`2${input.slice(1)}`, { input: commands }).lastOutput;
};
