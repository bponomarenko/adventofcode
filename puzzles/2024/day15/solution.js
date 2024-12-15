import { getNormalisedDirection, getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => {
  const [p1, moves] = input.split('\n\n');
  const grid = p1.toGrid();
  let start;
  grid.forEach((row, y) => row.forEach((char, x) => {
    if (char === '@') {
      start = [x, y];
      grid[y][x] = '.';
    }
  }));
  return [grid, start, moves.split('\n').flatMap(line => line.split('').map(getNormalisedDirection))];
};

const move = (grid, fx, fy, tx, ty) => {
  const char = grid[fy][fx];
  grid[fy][fx] = grid[ty][tx];
  grid[ty][tx] = char;
};

const tryToMove = (grid, [sx, sy], dir) => {
  const [x, y] = getRelativeCoord(sx, sy, dir);
  if (grid[y][x] !== '#' && (grid[y][x] === '.' || tryToMove(grid, [x, y], dir))) {
    move(grid, sx, sy, x, y);
    return true;
  }
  return false;
};

export const part1 = ([grid, pos, moves]) => {
  while (moves.length) {
    const dir = moves.shift();
    if (tryToMove(grid, pos, dir)) {
      pos = getRelativeCoord(...pos, dir);
    }
  }
  return grid.sum((row, y) => row.sum((char, x) => (char === 'O' ? y * 100 + x : 0)));
};

const canMove = (grid, sx, sy, dir) => {
  if (grid[sy][sx] === ']') {
    sx -= 1;
  }
  const [x, y] = getRelativeCoord(sx, sy, dir);
  return grid[y][x] !== '#'
    && grid[y][x + 1] !== '#'
    && (grid[y][x] === '.' || canMove(grid, x, y, dir))
    && (grid[y][x + 1] === '.' || grid[y][x + 1] === ']' || canMove(grid, x + 1, y, dir));
};

const moveBoxes = (grid, sx, sy, dir) => {
  if (grid[sy][sx] === ']') {
    sx -= 1;
  }
  const [x, y] = getRelativeCoord(sx, sy, dir);
  if (grid[y][x] !== '.') {
    moveBoxes(grid, x, y, dir);
  }
  if (grid[y][x + 1] !== '.' && grid[y][x + 1] !== ']') {
    moveBoxes(grid, x + 1, y, dir);
  }
  move(grid, sx, sy, x, y);
  move(grid, sx + 1, sy, x + 1, y);
};

export const part2 = ([grid, pos, moves]) => {
  grid = grid.map(row => row.flatMap(char => (char === 'O' ? '[]'.split('') : [char, char])));
  pos = [pos[0] * 2, pos[1]];
  while (moves.length) {
    const dir = moves.shift();
    const [x, y] = getRelativeCoord(...pos, dir);
    if (dir === 'w' || dir === 'e') {
      if (tryToMove(grid, pos, dir)) {
        pos = [x, y];
      }
    } else if (grid[y][x] !== '#') {
      if (grid[y][x] === '.') {
        move(grid, ...pos, x, y);
        pos = [x, y];
      } else if (canMove(grid, x, y, dir)) {
        moveBoxes(grid, x, y, dir);
        move(grid, ...pos, x, y);
        pos = [x, y];
      }
    }
  }
  return grid.sum((row, y) => row.sum((char, x) => (char === '[' ? y * 100 + x : 0)));
};
