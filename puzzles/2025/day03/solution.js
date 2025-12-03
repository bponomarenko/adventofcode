export const formatInput = input => input.split('\n').map(line => line.split('').map(Number));

const findMax = (arr, start, end) => {
  const max = Math.max(...arr.slice(start, end));
  return [max, arr.indexOf(max, start)];
};

const getMax = (arr, count) => {
  let res = '';
  let start = 0;
  let end = arr.length;

  for (let i = count - 1; i >= 0; i -= 1) {
    const [max, maxIndex] = findMax(arr, start, end - i);
    res += max;
    start = maxIndex + 1;
  }
  return +res;
};

export const part1 = input => input.map(arr => getMax(arr, 2)).sum();

export const part2 = input => input.map(arr => getMax(arr, 12)).sum();
