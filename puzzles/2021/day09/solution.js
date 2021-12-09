import { getAdjacent } from '../../2017/day14/solution.js';

export const formatInput = input => input.split('\n').map(line => line.split('').map(Number));

const getLowPoints = input => {
  const lowPoints = [];

  for (let i = 0; i < input.length; i += 1) {
    const line = input[i];

    for (let j = 0; j < line.length; j += 1) {
      const value = line[j];

      if (getAdjacent(input, i, j).every(([x, y]) => value < input[x][y])) {
        lowPoints.push([i, j]);
      }
    }
  }
  return lowPoints;
};

export const part1 = input => getLowPoints(input).reduce((acc, [x, y]) => acc + input[x][y] + 1, 0);

export const part2 = input => {
  const lowPoints = getLowPoints(input);
  const visited = new Set();

  const isNotBorder = ([x, y]) => !visited.has(`${x}-${y}`) && input[x][y] !== 9;

  const getSize = ([x, y]) => {
    let size = isNotBorder([x, y]) ? 1 : 0;
    if (size) {
      // Mark as "visited"
      visited.add(`${x}-${y}`);
    }
    return size + getAdjacent(input, x, y).filter(isNotBorder).reduce((acc, point) => acc + getSize(point), 0);
  };

  return lowPoints.map(getSize).sort((a, b) => a - b).slice(-3).reduce((acc, num) => acc * num, 1);
};
