export const formatInput = input => {
  const distributions = [];
  input.split('\n').forEach((line, r) => {
    if (r === 0) {
      // Prepare collection set
      for (let i = 0; i < line.length; i += 1) {
        distributions.push(new Map());
      }
    }

    line.split('').forEach((char, i) => {
      const col = distributions[i];
      col.set(char, (col.get(char) ?? 0) + 1);
    });
  });
  return distributions;
};

export const part1 = distributions => distributions
  .map(col => Array.from(col.entries()).sort(([, c1], [, c2]) => c2 - c1)[0][0])
  .join('');

export const part2 = distributions => distributions
  .map(col => Array.from(col.entries()).sort(([, c1], [, c2]) => c1 - c2)[0][0])
  .join('');
