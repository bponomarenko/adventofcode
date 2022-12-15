export const getStraightAdjacent = (grid, x, y) => [
  x > 0 ? [x - 1, y] : null,
  x < grid.length - 1 ? [x + 1, y] : null,
  y > 0 ? [x, y - 1] : null,
  y < grid[x].length - 1 ? [x, y + 1] : null,
].filter(Boolean);

export const getAdjacent = (grid, x, y) => getStraightAdjacent(grid, x, y)
  .concat([
    x > 0 && y > 0 ? [x - 1, y - 1] : null,
    x > 0 && y < grid[x].length - 1 ? [x - 1, y + 1] : null,
    x < grid.length - 1 && y > 0 ? [x + 1, y - 1] : null,
    x < grid.length - 1 && y < grid[x].length - 1 ? [x + 1, y + 1] : null,
  ].filter(Boolean));

export const rotate = (grid, clockwise = true) => {
  const rotatedGrid = [];
  for (let y = 0, my = grid[0].length; y < my; y += 1) {
    rotatedGrid.push([]);
    for (let x = 0, mx = grid.length; x < mx; x += 1) {
      rotatedGrid[y][x] = clockwise ? grid[mx - 1 - x][y] : grid[x][y];
    }
  }
  return rotatedGrid;
};

export const flip = (grid, byYAxis) => {
  if (byYAxis) {
    return grid.map(line => [...line].reverse());
  }
  const lastIndex = grid.length - 1;
  return grid.map((_, i) => [...grid[lastIndex - i]]);
};

export const getDistance = ([x1, y1, z1], [x2, y2, z2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs((z1 || 0) - (z2 || 0));
