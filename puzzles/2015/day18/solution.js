import { getAdjacent } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(line => line.split('').map(light => light === '#'));

const steps = 100;

const countNeighbours = (lights, i, j) => getAdjacent(j, i, [0, lights[0].length - 1], [0, lights.length - 1])
  .sum(([x, y]) => lights[y][x]);

export const part1 = input => {
  let step = 0;
  do {
    const prevState = JSON.parse(JSON.stringify(input));

    input.forEach((row, i) => row.forEach((light, j) => {
      const count = countNeighbours(prevState, i, j);
      input[i][j] = count === 3 || (light && count === 2);
    }));
    step += 1;
  } while (step < steps);
  return input.sum(row => row.sum(light => (light ? 1 : 0)));
};

export const part2 = input => {
  let step = 0;
  do {
    const prevState = JSON.parse(JSON.stringify(input));

    input.forEach((row, i) => row.forEach((light, j) => {
      if ((i === 0 || i === input.length - 1) && (j === 0 || j === row.length - 1)) {
        input[i][j] = true;
        return;
      }
      const count = countNeighbours(prevState, i, j);
      input[i][j] = count === 3 || (light && count === 2);
    }));
    step += 1;
  } while (step < steps);
  return input.sum(row => row.sum(light => (light ? 1 : 0)));
};
