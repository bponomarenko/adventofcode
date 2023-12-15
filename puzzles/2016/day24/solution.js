import aStar from 'javascript-astar';

export const formatInput = input => input.split('\n').map(line => line.split(''));

const findMinDistance = (input, returnToStart) => {
  const visitPoints = new Map();

  // Map input to a grid
  const grid = input.map((line, x) => line.map((char, y) => {
    if (char !== '#' && char !== '.') {
      visitPoints.set(char, [x, y]);
      return 1;
    }
    return char === '#' ? 0 : 1;
  }));

  const distances = new Map();

  // Function which returns distance between two points in the grid (with caching)
  const getDistance = (p1, p2) => {
    let distance = distances.get(`${p1}:${p2}`);
    if (distance != null) {
      return distance;
    }

    const [x1, y1] = visitPoints.get(p1);
    const [x2, y2] = visitPoints.get(p2);

    const graph = new aStar.Graph(grid);
    distance = aStar.astar.search(graph, graph.grid[x1][y1], graph.grid[x2][y2]).length;
    distances.set(`${p1}:${p2}`, distance);
    distances.set(`${p2}:${p1}`, distance);
    return distance;
  };

  let minDistances = Infinity;
  // Only consider path which starts from "0" position
  const points = Array.from(visitPoints.keys()).filter(point => point !== '0');

  // Find all the different path options, and find the one with minimum distance
  for (const perm of points.permutations(points.length)) {
    perm.unshift('0');
    if (returnToStart) {
      perm.push('0');
    }
    const distance = perm.slice(0, -1).reduce((acc, point, index) => acc + getDistance(point, perm[index + 1]), 0);
    minDistances = Math.min(minDistances, distance);
  }
  return minDistances;
};

export const part1 = input => findMinDistance(input);

export const part2 = input => findMinDistance(input, true);
