export const formatInput = input => input.toGrid('\n', 'x');

export const part1 = input => input
  .map(([l, w, h]) => {
    const parts = [l * w, l * h, w * h];
    return Math.min(...parts) + parts.reduce((acc, part) => acc + 2 * part, 0);
  })
  .reduce((acc, sq) => acc + sq, 0);

export const part2 = input => input
  .map(([a, b, c]) => 2 * a + 2 * b + a * b * c)
  .reduce((acc, sq) => acc + sq, 0);
