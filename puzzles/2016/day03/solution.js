export const formatInput = input => input.split('\n')
  .map(line => line.split(' ').filter(Boolean).map(v => +v));

export const part1 = input => input
  .filter(([a, b, c]) => (a + b > c) && (b + c > a) && (a + c > b))
  .length;

export const part2 = input => {
  const triangles = [];
  let stack = [[], [], []];

  input.forEach(sides => {
    sides.forEach((side, i) => stack[i].push(side));
    if (stack[0].length === 3) {
      triangles.push(...stack);
      stack = [[], [], []];
    }
  });
  return triangles.filter(([a, b, c]) => (a + b > c) && (b + c > a) && (a + c > b)).length;
};
