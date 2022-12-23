export const formatInput = input => input.split('').map(Number);

const getPatterns = size => new Array(size).fill(0).map((_, i) => {
  let pattern = new Array(i + 1).fill(0)
    .concat(new Array(i + 1).fill(1))
    .concat(new Array(i + 1).fill(0))
    .concat(new Array(i + 1).fill(-1));

  while (pattern.length < size + 1) {
    pattern.push(...pattern);
  }
  pattern = pattern.slice(1, size + 1)
    .map((value, j) => (value !== 0 ? [j, value] : null))
    .filter(Boolean);
  return input => Math.abs(pattern.reduce((sum, [index, mul]) => sum + input[index] * mul, 0) % 10);
});

const applyFFT = (input, phases) => {
  const patterns = getPatterns(input.length);
  for (let p = 0; p < phases; p += 1) {
    input = input.map((_, i) => patterns[i](input));
  }
  return input;
};

export const part1 = input => applyFFT(input, 100).slice(0, 8).join('');

export const part2 = input => {
  // It should work, but of course Node.js can't handle it. Should come up with different approach to solve it
  const offset = +input.slice(0, 7).join('');
  const message = applyFFT(input.join('').repeat(10000).split(''), 100);
  return message.slice(offset, offset + 8).join('');
};
