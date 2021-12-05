export const formatInput = input => input.split('\n');

const process = (range, fn) => {
  const [start, end] = range.split(' through ');
  const [x1, y1] = start.split(',');
  const [x2, y2] = end.split(',');

  for (let i = +x1; i <= +x2; i += 1) {
    for (let j = +y1; j <= +y2; j += 1) {
      fn(i, j);
    }
  }
};

export const part1 = input => {
  const matrix = new Array(1000).fill(0).map(() => new Array(1000).fill(false));

  const types = [
    ['turn on ', (x, y) => { matrix[x][y] = true; }],
    ['turn off ', (x, y) => { matrix[x][y] = false; }],
    ['toggle ', (x, y) => { matrix[x][y] = !matrix[x][y]; }],
  ];

  input.forEach(instruction => {
    if (!instruction) {
      return;
    }
    const [prefix, fn] = types.find(([pref]) => instruction.startsWith(pref));
    process(instruction.slice(prefix.length), fn);
  });

  let count = 0;
  matrix.forEach(row => row.forEach(isOn => {
    count += isOn ? 1 : 0;
  }));
  return count;
};

export const part2 = input => {
  const matrix = new Array(1000).fill(0).map(() => new Array(1000).fill(0));

  const types = [
    ['turn on ', (x, y) => {
      matrix[x][y] += 1;
    }],
    ['turn off ', (x, y) => {
      matrix[x][y] = Math.max(matrix[x][y] - 1, 0);
    }],
    ['toggle ', (x, y) => {
      matrix[x][y] += 2;
    }],
  ];

  input.forEach(instruction => {
    if (!instruction) {
      return;
    }
    const [prefix, fn] = types.find(([pref]) => instruction.startsWith(pref));
    process(instruction.slice(prefix.length), fn);
  });

  let count = 0;
  matrix.forEach(row => row.forEach(brightness => {
    count += brightness;
  }));
  return count;
};
