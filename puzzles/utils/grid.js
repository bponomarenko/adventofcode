const filterInLimits = (limitsX, limitsY, limitsZ) => ([x, y, z]) => (!limitsX || (x >= limitsX[0] && x <= limitsX[1]))
  && (!limitsY || (y >= limitsY[0] && y <= limitsY[1]))
  && (!limitsZ || (z >= limitsZ[0] && z <= limitsZ[1]));

export const getStraightAdjacent = (x, y, ...limits) => [
  [x - 1, y],
  [x + 1, y],
  [x, y - 1],
  [x, y + 1],
].filter(filterInLimits(...limits));

export const getAdjacent = (x, y, ...limits) => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
].filter(filterInLimits(...limits));

export const getStraightAdjacent3d = (x, y, z, ...limits) => [
  [x - 1, y, z],
  [x + 1, y, z],
  [x, y - 1, z],
  [x, y + 1, z],
  [x, y, z - 1],
  [x, y, z + 1],
].filter(filterInLimits(...limits));

export const isStraightAdjacent3d = ([x1, y1, z1], [x2, y2, z2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2) === 1;

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
