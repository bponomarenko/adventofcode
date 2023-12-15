export const formatInput = input => input.split('\n').map(Number).sort((a, b) => a - b);

export const part1 = input => {
  const diffs = [0, 0, 1];
  let acc = 0;

  input.forEach(n => {
    diffs[n - acc - 1] += 1;
    acc = n;
  });
  return diffs[0] * diffs[2];
};

export const part2 = arr => {
  arr.splice(0, 0, 0);
  arr.push(Math.max(...arr) + 3);

  const distances = [];
  let distance = 0;

  for (let i = 0, l = arr.length; i < l; i += 1) {
    if (arr[i] - (arr[i - 1] || 0) === 1) {
      distance += 1;
    } else {
      if (distance > 1) {
        distances.push(distance - 1);
      }
      distance = 0;
    }
  }
  return distances.power(d => (2 ** d - (d > 2 ? 1 : 0)));
};
