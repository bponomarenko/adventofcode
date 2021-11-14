const main = input => {
  const arr = input.split('\n')
    .map(n => +n)
    .sort((a, b) => a - b);
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
  return distances.reduce((acc, d) => acc * (2 ** d - (d > 2 ? 1 : 0)), 1);
};

module.exports = { main };
