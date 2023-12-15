import { changeDirection } from '../../utils/grid.js';

export const formatInput = input => {
  const [map, path] = input.split('\n\n');
  return [
    map.split('\n').map(line => line.replace('0', ' ').split('')),
    path.match(/(\d+)([LR]?)/g).flatMap(line => (line.endsWith('L') || line.endsWith('R') ? [+line.slice(0, -1), line.slice(-1)] : +line)),
  ];
};
formatInput.doNotTrim = true;

const directions = ['e', 's', 'w', 'n'];

const followThePath = (grid, path, getNextPos) => {
  let x = grid[0].findIndex(tile => tile === '.');
  let y = 0;
  let dir = 'e';

  while (path.length) {
    let step = path.shift();
    // change direction
    if (step === 'L') {
      dir = changeDirection(dir, -90);
    } else if (step === 'R') {
      dir = changeDirection(dir, 90);
    } else {
      // ...or do the move, step by step
      while (step > 0) {
        const [nextPos, nextDir] = getNextPos(x, y, dir);
        if (grid[nextPos[1]][nextPos[0]] === '#') {
          step = 0;
        } else {
          [x, y] = nextPos;
          // direction can change in the part2
          dir = nextDir;
        }
        step -= 1;
      }
    }
  }
  return 1000 * (y + 1) + 4 * (x + 1) + directions.indexOf(dir);
};

export const part1 = ([grid, path]) => followThePath(grid, path, (x, y, dir) => {
  switch (dir) {
    case 'e':
      return [[x + 1 >= grid[y].length ? grid[y].findIndex(tile => tile !== ' ') : x + 1, y], dir];
    case 'w':
      return [[x - 1 < 0 || grid[y][x - 1] === ' ' ? grid[y].length - 1 : x - 1, y], dir];
    case 's':
      return [[x, y + 1 >= grid.length || x >= grid[y + 1].length ? grid.findIndex(row => row[x] !== ' ') : y + 1], dir];
    case 'n':
      return [[x, y - 1 < 0 || grid[y - 1][x] === ' ' ? grid.findLastIndex(row => x < row.length) : y - 1], dir];
  }
  return null;
});

export const part2 = ([grid, path], isTest) => {
  const size = isTest ? 4 : 50;
  return followThePath(grid, path, (x, y, dir) => {
    // Do woodoo "wrapping" around the sides of the cube
    // (solution hardcoded to the data structure of the input file, so it doesn't work for the example from the puzzle)
    switch (dir) {
      case 'e':
        if (x + 1 >= grid[y].length) {
          if (y < size) {
            return [[size * 2 - 1, size * 3 - 1 - y], 'w'];
          }
          if (y < size * 2) {
            return [[y + size, size - 1], 'n'];
          }
          if (y < size * 3) {
            return [[size * 3 - 1, size * 3 - 1 - y], 'w'];
          }
          return [[y - size * 2, size * 3 - 1], 'n'];
        }
        return [[x + 1, y], dir];
      case 'w':
        if (x - 1 < 0 || grid[y][x - 1] === ' ') {
          if (y < size) {
            return [[0, size * 3 - 1 - y], 'e'];
          }
          if (y < size * 2) {
            return [[y - size, size * 2], 's'];
          }
          if (y < size * 3) {
            return [[size, size * 3 - 1 - y], 'e'];
          }
          return [[y - size * 2, 0], 's'];
        }
        return [[x - 1, y], dir];
      case 's':
        if (y + 1 >= grid.length || x >= grid[y + 1].length) {
          if (x < size) {
            return [[x + size * 2, 0], dir];
          }
          if (x < size * 2) {
            return [[size - 1, size * 2 + x], 'w'];
          }
          return [[size * 2 - 1, x - size], 'w'];
        }
        return [[x, y + 1], dir];
      case 'n':
        if (y - 1 < 0 || grid[y - 1][x] === ' ') {
          if (x < size) {
            return [[size, x + size], 'e'];
          }
          if (x < size * 2) {
            return [[0, x + size * 2], 'e'];
          }
          return [[x - size * 2, size * 4 - 1], dir];
        }
        return [[x, y - 1], dir];
    }
    return null;
  });
};
