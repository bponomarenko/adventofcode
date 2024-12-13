export const formatInput = input => input.split('\n\n').map(block => block.split('\n').map(row => row.split(': ')[1].split(', ').map(line => +line.slice(2))));

const countTokens = (a, b, p) => {
  const minB = (p[0] * a[1] - a[0] * p[1]) / (b[0] * a[1] - a[0] * b[1]);
  if (minB % 1 !== 0) {
    return 0;
  }
  const minA = (p[0] - minB * b[0]) / a[0];
  return minA % 1 !== 0 ? 0 : minA * 3 + minB;
};

export const part1 = input => input.sum(params => countTokens(...params));

export const part2 = input => input.sum(([a, b, p]) => countTokens(a, b, p.map(num => num + 10000000000000)));
