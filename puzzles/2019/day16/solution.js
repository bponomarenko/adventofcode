export const formatInput = input => input.split('').map(Number);

const applyFFT = (input, phases) => {
  const len = input.length;
  while (phases) {
    input = input.map((_, i) => {
      let sum = 0;
      for (let p = i; p < len; p += 4 * (i + 1)) {
        for (let d = 0; d < i + 1 && p + d < len; d += 1) {
          sum += input[p + d];
        }
      }
      for (let p = 3 * i + 2; p < len; p += 4 * (i + 1)) {
        for (let d = 0; d < i + 1 && p + d < len; d += 1) {
          sum -= input[p + d];
        }
      }
      return Math.abs(sum % 10);
    });
    phases -= 1;
  }
  return input;
};

export const part1 = input => applyFFT(input, 100).slice(0, 8).join('');

export const part2 = input => {
  // It should work, but of course Node.js can't handle it. Should come up with different approach to solve it
  const offset = +input.slice(0, 7).join('');
  const message = applyFFT(input.join('').repeat(10000).split('').map(Number), 100);
  return message.slice(offset, offset + 8).join('');
};
