import jsAStar from 'javascript-astar';

const { astar, Graph } = jsAStar;
const nodeRe = /\/dev\/grid\/node-x(\d+)-y(\d+) +\d+T +(\d+)T +(\d+)T/;

export const formatInput = input => input.split('\n').slice(2).map(node => {
  const [, x, y, used, available] = nodeRe.exec(node);
  return { x: +x, y: +y, used: +used, available: +available };
});

export const part1 = nodes => Array.from(nodes.combinations(2))
  .filter(([a, b]) => (a.used > 0 && a.used <= b.available) || (b.used > 0 && b.used <= a.available))
  .length;

export const part2 = async nodes => {
  const grid = [];
  let zeroPos;

  // Normalize data
  nodes.forEach(node => {
    if (!grid[node.y]) {
      grid[node.y] = [];
    }
    grid[node.y][node.x] = [node.used, node.used + node.available];

    if (node.used === 0) {
      zeroPos = [node.y, node.x];
    }
  });

  const weightenedGrid = grid.map(line => line.map(([used]) => (used > 100 ? 0 : 1)));

  // Find short path between wanted node and its target place
  let dataPos = [0, grid[0].length - 1];
  let graph = new Graph(weightenedGrid);
  const targetPath = astar.search(graph, graph.grid[dataPos[0]][dataPos[1]], graph.grid[0][0]).map(({ x, y }) => [x, y]);

  // Amount of steps to get to the point in front of the data point
  let count = 0;

  while (targetPath.length) {
    const originalWeight = weightenedGrid[dataPos[0]][dataPos[1]];
    weightenedGrid[dataPos[0]][dataPos[1]] = 0;
    graph = new Graph(weightenedGrid);
    weightenedGrid[dataPos[0]][dataPos[1]] = originalWeight;

    const start = graph.grid[zeroPos[0]][zeroPos[1]];
    zeroPos = targetPath.shift();
    count += astar.search(graph, start, graph.grid[zeroPos[0]][zeroPos[1]]).length + 1;
    [dataPos, zeroPos] = [zeroPos, dataPos];
  }
  return count;
};
