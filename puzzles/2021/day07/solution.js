export const formatInput = input => input.split(',').map(Number);

export const part1 = input => {
  const max = Math.max(...input);
  let min = Infinity;

  for (let i = 0; i < max; i += 1) {
    min = Math.min(input.reduce((acc, num) => acc + Math.abs(num - i), 0), min);
  }
  return min;
};

const rate = steps => (steps * (steps + 1)) / 2;

export const part2 = input => {
  const max = Math.max(...input);
  let min = Infinity;

  for (let i = 0; i < max; i += 1) {
    min = Math.min(min, input.reduce((acc, num) => acc + rate(Math.abs(num - i)), 0));
  }
  return min;
};
