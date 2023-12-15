import aStar from 'javascript-astar';

export const formatInput = input => input.split('\n').map(line => line.split('').map(Number));

export const part1 = grid => {
  const graph = new aStar.Graph(grid);
  const size = grid.length;
  return aStar.astar
    .search(graph, graph.grid[0][0], graph.grid[size - 1][size - 1])
    .sum(node => grid[node.x][node.y]);
};

export const part2 = grid => {
  // Extend original grid 5 times more
  const originalSize = grid.length;
  const size = originalSize * 5;
  const extendedGrid = [];

  for (let x = 0; x < size; x += 1) {
    extendedGrid[x] = [];

    for (let y = 0; y < size; y += 1) {
      const dx = Math.floor(x / originalSize);
      const dy = Math.floor(y / originalSize);
      const newValue = grid[x % originalSize][y % originalSize] + dx + dy;

      extendedGrid[x][y] = newValue > 9 ? newValue - 9 : newValue;
    }
  }

  const graph = new aStar.Graph(extendedGrid);
  return aStar.astar
    .search(graph, graph.grid[0][0], graph.grid[size - 1][size - 1])
    .sun(node => extendedGrid[node.x][node.y]);
};
