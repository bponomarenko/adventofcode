import aStar from 'javascript-astar';

export const formatInput = input => input.split('\n').map(line => line.split('').map(Number));

export const part1 = grid => {
  const graph = new aStar.Graph(grid);
  const size = grid.length;
  return aStar.astar
    .search(graph, graph.grid[0][0], graph.grid[size - 1][size - 1])
    .reduce((acc, node) => acc + grid[node.x][node.y], 0);
};

const duplicateGrid = (grid, inc) => grid.map(line => line.map(num => {
  const sum = num + inc;
  return sum > 9 ? sum - 9 : sum;
}));

export const part2 = grid => {
  // Extend original grid 5 times more
  const originalGrid = JSON.parse(JSON.stringify(grid));
  const originalSize = grid.length;

  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      if (i === 0 && j === 0) {
        continue;
      }
      const extension = duplicateGrid(originalGrid, i + j);
      extension.forEach((line, li) => {
        if (j === 0) {
        // Merge down
          grid.push(line);
        } else {
        // Merge to the right
          grid[i * originalSize + li].push(...line);
        }
      });
    }
  }

  const size = grid.length;
  const graph = new aStar.Graph(grid);
  return aStar.astar
    .search(graph, graph.grid[0][0], graph.grid[size - 1][size - 1])
    .reduce((acc, node) => acc + grid[node.x][node.y], 0);
};
