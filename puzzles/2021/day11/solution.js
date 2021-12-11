export const formatInput = input => input.split('\n').map(line => line.split('').map(Number));

const getAdjacent = (input, x, y) => [
  x > 0 && y > 0 ? [x - 1, y - 1] : null,
  x > 0 ? [x - 1, y] : null,
  x > 0 && y < input[x].length - 1 ? [x - 1, y + 1] : null,
  y > 0 ? [x, y - 1] : null,
  y < input[x].length - 1 ? [x, y + 1] : null,
  x < input.length - 1 && y > 0 ? [x + 1, y - 1] : null,
  x < input.length - 1 ? [x + 1, y] : null,
  x < input.length - 1 && y < input[x].length - 1 ? [x + 1, y + 1] : null,
].filter(Boolean);

const updateEnergyLevels = input => {
  const adjacent = [];
  let flashes = 0;

  input.forEach((line, x) => line.forEach((energy, y) => {
    if (energy === 9) {
      flashes += 1;
      adjacent.push(...getAdjacent(input, x, y));
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
      adjacent.push(...getAdjacent(input, x, y));
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
