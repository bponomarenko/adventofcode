import { getStraightAdjacent } from '../../utils/grid.js';

export const formatInput = input => {
  const rows = input.split('\n');
  let start;
  let end;
  const grid = rows.map((row, y) => row.split('').map((char, x) => {
    if (char === 'S') {
      start = [x, y];
      return 0;
    }
    if (char === 'E') {
      end = [x, y];
      return 25;
    }
    return char.charCodeAt(0) - 97;
  }));
  return { start, end, grid };
};

const getMoveOptions = (grid, [x, y]) => getStraightAdjacent(y, x, [0, grid.length - 1], [0, grid[0].length - 1])
  .map(node => node.reverse())
  .filter(node => grid[y][x] - grid[node[1]][node[0]] <= 1);

const findShortestPath = (grid, start, isFinish) => {
  const queue = [{ tail: start, length: 1 }];
  const visited = new Set();
  let shortestPath = Infinity;

  while (queue.length) {
    let { tail, length } = queue.shift();
    const key = tail.join(',');
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);
    const options = getMoveOptions(grid, tail);
    if (options.some(isFinish)) {
      shortestPath = Math.min(shortestPath, length);
    }
    options
      .sort((node1, node2) => node2[0] - node1[0])
      .forEach(node => {
        queue.push({ tail: node, length: length + 1 });
      });
  }
  return shortestPath;
};

export const part1 = ({ start, end, grid }) => findShortestPath(grid, end, node => node[0] === start[0] && node[1] === start[1]);

export const part2 = ({ end, grid }) => findShortestPath(grid, end, node => grid[node[1]][node[0]] === 0);
