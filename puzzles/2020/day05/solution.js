export const formatInput = input => input.split('\n');

export const part1 = input => {
  const ids = input.map(line => parseInt(line.replace(/F|L/g, 0).replace(/B|R/g, 1), 2));
  return Math.max(...ids);
};

export const part2 = input => {
  const ids = input
    .map(line => parseInt(line.replace(/F|L/g, 0).replace(/B|R/g, 1), 2))
    .sort((a, b) => a - b);

  for (let i = 1; i < ids.length - 1; i += 1) {
    if (ids[i] - ids[i - 1] > 1) {
      return ids[i] - 1;
    }
  }
  return null;
};
