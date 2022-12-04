export const getSquareSum = (grid, sx, sy, size) => {
  const my = sy + size;
  const mx = sx + size;
  let sum = 0;

  for (let y = sy; y < my; y += 1) {
    for (let x = sx; x < mx; x += 1) {
      sum += grid[y][x];
    }
  }
  return sum;
};

export const fillGrid = serial => new Array(300).fill(0).map((_, y) => new Array(300).fill(0).map((__, x) => {
  const rackId = x + 11;
  let level = ((rackId * (y + 1)) + serial) * rackId;
  level = Math.floor((level % 1000) / 100);
  return level - 5;
}));
