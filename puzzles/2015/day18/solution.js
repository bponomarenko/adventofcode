export const formatInput = input => input.split('\n').map(line => line.split('').map(light => light === '#'));

const steps = 100;

const countNeighbours = (lights, i, j) => (
  (lights[i - 1]?.[j - 1] ?? 0)
  + (lights[i - 1]?.[j] ?? 0)
  + (lights[i - 1]?.[j + 1] ?? 0)
  + (lights[i][j - 1] ?? 0)
  + (lights[i][j + 1] ?? 0)
  + (lights[i + 1]?.[j - 1] ?? 0)
  + (lights[i + 1]?.[j] ?? 0)
  + (lights[i + 1]?.[j + 1] ?? 0)
);

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
  return input.reduce((acc, row) => acc + row.reduce((res, light) => res + (light ? 1 : 0), 0), 0);
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
  return input.reduce((acc, row) => acc + row.reduce((res, light) => res + (light ? 1 : 0), 0), 0);
};
