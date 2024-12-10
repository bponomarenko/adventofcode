import { getAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(line => line.split('').map(Number));

const updateEnergyLevels = input => {
  const adjacent = [];
  const limits = input.gridLimits();
  let flashes = 0;

  input.forEach((line, x) => line.forEach((energy, y) => {
    if (energy === 9) {
      flashes += 1;
      adjacent.push(...getAdjacent(x, y, ...limits));
      line[y] = 0;
    } else {
      line[y] = energy + 1;
    }
  }));

  while (adjacent.length > 0) {
    const [x, y] = adjacent.shift();
    const energy = input[x][y];
    if (energy > 0 && energy < 9) {
      input[x][y] += 1;
    } else if (energy === 9) {
      input[x][y] = 0;
      flashes += 1;
      adjacent.push(...getAdjacent(x, y, ...limits));
    }
  }
  return flashes;
};

export const part1 = input => {
  let flashes = 0;
  for (let i = 0; i < 100; i += 1) {
    flashes += updateEnergyLevels(input);
  }
  return flashes;
};

export const part2 = async input => {
  let flashes = 0;
  let count = 0;
  do {
    flashes = updateEnergyLevels(input);
    count += 1;
  } while (flashes !== 100);
  return count;
};
