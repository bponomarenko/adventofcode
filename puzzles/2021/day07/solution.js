export const formatInput = input => input.split(',').map(Number);

export const part1 = input => {
  const max = Math.max(...input);
  let min = Infinity;

  for (let i = 0; i < max; i += 1) {
    min = Math.min(input.sum(num => Math.abs(num - i)), min);
  }
  return min;
};

const rate = steps => (steps * (steps + 1)) / 2;

export const part2 = input => {
  const max = Math.max(...input);
  let min = Infinity;

  for (let i = 0; i < max; i += 1) {
    min = Math.min(min, input.sum(num => rate(Math.abs(num - i))));
  }
  return min;
};
