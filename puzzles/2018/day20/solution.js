import { getRelativeCoord, getStraightAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.slice(1, -1);

const arr = length => new Array(length).fill('?');
const fillGaps = matrix => matrix.map(row => row.map(cell => (cell === '?' ? '#' : cell)));

const getMatrix = input => {
  const matrix = '.'.toGrid();
  let startPos = [0, 0];

  const expandMatrix = (path, startFrom) => {
    const start = [...startFrom];
    let pos = [...startFrom];
    let index = 0;

    while (index < path.length) {
      const dir = path[index];
      if (dir === '(') {
        index += expandMatrix(path.slice(index + 1), pos) + 1;
      } else if (dir === ')') {
        return index;
      } else if (dir === '|') {
        pos = [...start];
      } else {
        let [x, y] = getRelativeCoord(pos[0], pos[1], dir, 2);
        if (x > matrix[0].length) {
          matrix.forEach(row => {
            row.push('?', '?');
          });
        } else if (x < 0) {
          matrix.forEach(row => {
            row.splice(0, 0, '?', '?');
          });
          pos[0] += 2;
          startPos[0] += 2;
          start[0] += 2;
          x += 2;
        } else if (y > matrix.length) {
          matrix.push(arr(matrix[0].length), arr(matrix[0].length));
        } else if (y < 0) {
          matrix.splice(0, 0, arr(matrix[0].length), arr(matrix[0].length));
          pos[1] += 2;
          startPos[1] += 2;
          start[1] += 2;
          y += 2;
        }
        const [dx, dy] = getRelativeCoord(pos[0], pos[1], dir, 1);
        matrix[dy][dx] = dir === 'W' || dir === 'E' ? '|' : '-';
        matrix[y][x] = '.';
        pos = [x, y];
      }
      index += 1;
    }
    return 0;
  };
  expandMatrix(input, startPos);
  return [fillGaps(matrix), startPos];
};

const getMoveOptions = (grid, [x, y], limits) => getStraightAdjacent(x, y, ...limits)
  .filter(([nx, ny]) => grid[ny][nx] !== '#');

const findShortestPath = (grid, start, end) => {
  const limits = [[0, grid[0].length - 1], [0, grid.length - 1]];
  const queue = [{ path: [start], length: 1 }];
  const visited = new Set();
  let shortestPath = null;
  let shortestPathLength = Infinity;

  while (queue.length) {
    let { path, length } = queue.shift();
    const tail = path.at(-1);
    const key = tail.join(',');
    if (visited.has(key) || length >= shortestPathLength) {
      continue;
    }
    visited.add(key);
    const options = getMoveOptions(grid, tail, limits);
    if (options.some(([x, y]) => x === end[0] && y === end[1])) {
      shortestPath = path;
      shortestPathLength = length;
    } else {
      options.forEach(node => {
        queue.push({ path: [...path, node], length: length + 1 });
      });
    }
  }
  return shortestPath;
};

export const part1 = input => {
  const [matrix, start] = getMatrix(input);
  const visited = new Set([start.join('-')]);
  let longestPath = 0;
  matrix.forEach((row, y) => row.forEach((cell, x) => {
    if (cell === '.' && !visited.has(`${x}-${y}`)) {
      const path = findShortestPath(matrix, [x, y], start);
      longestPath = Math.max(longestPath, path.length);
      path.forEach(node => visited.add(node.join('-')));
    }
  }));
  return longestPath / 2;
};

export const part2 = input => {
  const result = part1(input);
  console.log(result);
  return null;
};
