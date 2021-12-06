export const formatInput = input => +input;

export const part1 = input => {
  // Find max power of 2
  const bin = input.toString(2).split('');
  bin.push(bin.shift());
  return parseInt(bin.join(''), 2);
};

export const part2 = input => {
  let i = 1;
  while (i * 3 < input) {
    i *= 3;
  }
  return input - i;
};
