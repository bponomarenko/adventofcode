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
