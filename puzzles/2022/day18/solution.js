import { sum, combinations } from '../../utils/collections.js';
import { getStraightAdjacent3d, isStraightAdjacent3d } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(row => row.split(',').map(Number));

export const part1 = input => {
  const openSides = new Map(input.map(cube => [cube.join(','), 6]));
  for (let [c1, c2] of combinations(input, 2)) {
    if (isStraightAdjacent3d(c1, c2)) {
      openSides.set(c1.join(','), openSides.get(c1.join(',')) - 1);
      openSides.set(c2.join(','), openSides.get(c2.join(',')) - 1);
    }
  }
  return sum(Array.from(openSides.values()));
};

const getLimits = input => {
  const x = input.map(([dx]) => dx);
  const y = input.map(([, dy]) => dy);
  const z = input.map(([, , dz]) => dz);
  return [
    [Math.min(...x) - 1, Math.max(...x) + 1],
    [Math.min(...y) - 1, Math.max(...y) + 1],
    [Math.min(...z) - 1, Math.max(...z) + 1],
  ];
};

export const part2 = cubes => {
  const cubesSet = new Set(cubes.map(cube => cube.join(',')));
  const openAir = new Set();

  const [lx, ly, lz] = getLimits(cubes);
  const queue = [[lx[0], ly[0], lz[0]]];
  const processed = new Set([queue[0].join(',')]);

  // Fill open air
  do {
    const cube = queue.shift();
    openAir.add(cube.join(','));
    // Add more cubes to process
    getStraightAdjacent3d(cube[0], cube[1], cube[2], lx, ly, lz).forEach(adjCube => {
      const hash = adjCube.join(',');
      // if we already found it or it is a block or it queued already – skip it
      if (processed.has(hash) || openAir.has(hash) || cubesSet.has(hash)) {
        return;
      }
      processed.add(hash);
      queue.push(adjCube);
    });
  } while (queue.length);
  // Count sides of each cube that does touch only open air
  const openAirSides = cubes.map(cube => getStraightAdjacent3d(...cube).filter(adjCube => openAir.has(adjCube.join(','))).length);
  return sum(openAirSides);
};
