import Intcode from '../intcode.js';

export const formatInput = input => input;

export const part1 = input => {
  let count = 0;
  for (let y = 0; y < 50; y += 1) {
    for (let x = 0; x < 50; x += 1) {
      count += new Intcode(input, { input: [x, y] }).lastOutput;
    }
  }
  return count;
};

export const part2 = input => {
  let y = 99;
  let x = 0;

  for (; ;) {
    for (; ;) {
      if (new Intcode(input, { input: [x, y] }).lastOutput === 0) {
        x += 1;
      } else {
        break;
      }
    }

    // Check if diagonal is also 1
    if (new Intcode(input, { input: [x + 100 - 1, y - 100 + 1] }).lastOutput === 1) {
      return x * 10000 + (y - 100 + 1);
    }
    y += 1;
  }
};
