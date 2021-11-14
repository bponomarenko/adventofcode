const main = input => {
  const diffs = [0, 0, 1];
  let acc = 0;

  input.split('\n')
    .map(n => +n)
    .sort((a, b) => a - b)
    .forEach(n => {
      diffs[n - acc - 1] += 1;
      acc = n;
    });
  return diffs[0] * diffs[2];
};

module.exports = { main };
